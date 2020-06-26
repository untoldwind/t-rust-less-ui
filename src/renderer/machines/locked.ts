import { MachineConfig, assign, send } from "xstate";
import { listStores, getDefaultStore, identities, unlock } from "./backend-neon";
import { Identity } from "../../../native";
import { MainEvents, MainContext } from "./main";
import { StatusMonitor } from "./status-monitor";

export interface LockedContext {
  storeNames: string[]
  selectedStore?: string
  selectedIdentity?: Identity
  errorMessage?: string
  identities: Identity[];
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
  initial: "fetch_store_names",
  states: {
    fetch_store_names: {
      invoke: {
        src: listStores,
        onDone: {
          target: "fetch_default_store",
          actions: assign({ storeNames: (_, event) => event.data }),
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
          actions: assign({ selectedStore: (_, event) => event.data }),
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
        src: context => {
          const { selectedStore } = context;
          if (!selectedStore) return Promise.reject("Invalid state");
          return identities(selectedStore);
        },
        onDone: {
          target: "select_store",
          actions: assign((_, event) => ({
            identities: event.data,
            selectedIdentity: event.data.length > 0 ? event.data[0] : undefined,
          })),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    select_store: {
      invoke: {
        src: context => callback => {
          const { selectedStore } = context;
          if (!selectedStore) return () => { };
          return new StatusMonitor(callback, selectedStore, "LOCKED").shutdown;
        },
      },
      on: {
        TRY_UNLOCK: {
          cond: context => typeof context.selectedIdentity === "object",
          target: "try_unlock",
        },
        SELECT_STORE: {
          target: "fetch_identities",
          actions: assign({ selectedStore: (_, event) => event.storeName }),
        },
        SELECT_IDENTITY: {
          actions: assign({ selectedIdentity: (context, event) => context.identities.find(identity => identity.id === event.identityId) }),
        },
      },
    },
    try_unlock: {
      invoke: {
        src: (context, event) => {
          const { selectedStore, selectedIdentity } = context;
          if (!selectedStore || !selectedIdentity) return Promise.reject("Invalid state");
          if (event.type !== "TRY_UNLOCK") return Promise.reject("Invalid event");

          return unlock(selectedStore, selectedIdentity.id, event.passphrase);
        },
        onDone: {
          actions: send(context => ({
            type: "STORE_UNLOCKED",
            storeName: context.selectedStore,
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