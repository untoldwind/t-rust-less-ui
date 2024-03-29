import { MachineConfig, assign, send } from "xstate";
import { listStores, getDefaultStore, identities, unlock, Identity, StoreConfig } from "./backend-tauri";
import { MainEvents, MainContext } from "./main";
import { StatusMonitor } from "./status-monitor";

export interface LockedContext {
  storeConfigs: StoreConfig[]
  selectedStoreConfig?: StoreConfig
  selectedIdentity?: Identity
  errorMessage?: string
  identities: Identity[]
}

export type LockedEvent =
  | { type: "SELECT_STORE", storeName: string }
  | { type: "SELECT_IDENTITY", identityId: string }
  | { type: "TRY_UNLOCK", passphrase: string }

export type LockedState =
  | {
    value: "locked.select_store"
    context: MainContext
  }
  | {
    value: "locked.try_unlock"
    context: MainContext
  }
  | {
    value: "locked.error"
    context: MainContext & {
      errorMessage: string
    }
  }

export const lockedState: MachineConfig<MainContext, any, MainEvents> = {
  initial: "fetch_store_configs",
  states: {
    fetch_store_configs: {
      invoke: {
        src: listStores,
        onDone: {
          target: "fetch_default_store",
          actions: assign({ storeConfigs: (_, event) => event.data }),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    fetch_default_store: {
      invoke: {
        src: getDefaultStore,
        onDone: [{
          target: "fetch_identities",
          cond: (_, event) => typeof event.data === "string",
          actions: assign({ selectedStoreConfig: (context, event) => context.storeConfigs.find(storeConfig => storeConfig.name == event.data) }),
        }, {
          target: "select_store",
          cond: (_, event) => typeof event.data !== "string",
        }],
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    fetch_identities: {
      invoke: {
        src: ({ selectedStoreConfig }) => {
          if (!selectedStoreConfig) return Promise.reject("Invalid state");
          return identities(selectedStoreConfig.name);
        },
        onDone: {
          target: "select_store",
          actions: assign(({ selectedStoreConfig }, event) => {
            const identities: Identity[] = event.data;
            let selectedIdentity = identities.find(identity => identity.id === selectedStoreConfig?.default_identity_id);
            if (!selectedIdentity && identities.length > 0) selectedIdentity = identities[0];

            return {
              identities,
              selectedIdentity,
            }
          }),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    select_store: {
      invoke: {
        src: ({ selectedStoreConfig }) => callback => {
          if (!selectedStoreConfig) return () => { };
          return new StatusMonitor(callback, selectedStoreConfig.name, "LOCKED").shutdown;
        },
      },
      on: {
        TRY_UNLOCK: {
          cond: ({ selectedIdentity }) => typeof selectedIdentity === "object",
          target: "try_unlock",
        },
        SELECT_STORE: {
          target: "fetch_identities",
          actions: assign({ selectedStoreConfig: (context, event) => context.storeConfigs.find(storeConfig => storeConfig.name == event.storeName) }),
        },
        SELECT_IDENTITY: {
          actions: assign({ selectedIdentity: (context, event) => context.identities.find(identity => identity.id === event.identityId) }),
        },
      },
    },
    try_unlock: {
      invoke: {
        src: ({ selectedStoreConfig, selectedIdentity }, event) => {
          if (!selectedStoreConfig || !selectedIdentity) return Promise.reject("Invalid state");
          if (event.type !== "TRY_UNLOCK") return Promise.reject("Invalid event");

          return unlock(selectedStoreConfig.name, selectedIdentity.id, event.passphrase);
        },
        onDone: {
          actions: send(context => ({
            type: "STORE_UNLOCKED",
            storeName: context.selectedStoreConfig?.name,
            identity: context.selectedIdentity,
          })),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    error: {
      on: {
        CONFIRM_ERROR: "select_store",
      },
    },
  },
};
