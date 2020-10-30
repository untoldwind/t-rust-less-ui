import { assign, MachineConfig } from "xstate"
import { Identity, StoreConfig } from "../../../native";
import { addIdentity, generateId, getDefaultStore, identities, listStores, setDefaultStore, upsertStoreConfig } from "./backend-neon";
import { MainContext, MainEvents } from "./main"

export interface ConfigContext {
  storeConfigs: StoreConfig[]
  errorMessage?: string
  selectedStoreConfig?: StoreConfig
  defaultStoreName?: string
  identities: Identity[]
}

export type ConfigEvent =
  | { type: "CLOSE_CONFIG" }
  | { type: "SAVE_CONFIG", storeConfig: StoreConfig }
  | { type: "ADD_IDENTITY", identity: Identity, passphrase: string }
  | { type: "SET_DEFAULT_STORE", storeName: string }

export type ConfigState =
  | {
    value: "config.show_stores"
    context: MainContext
  }
  | {
    value: "config.error"
    context: MainContext & {
      errorMessage: string
    }
  }

async function saveConfigAction(context: MainContext, event: MainEvents): Promise<StoreConfig> {
  if (event.type !== "SAVE_CONFIG") throw new Error("Invalid event");
  const { storeConfig } = event;

  if (storeConfig.client_id.length === 0)
    storeConfig.client_id = await generateId();

  return upsertStoreConfig(storeConfig);
}

async function addIdentityAction(context: MainContext, event: MainEvents): Promise<void> {
  if (event.type !== "ADD_IDENTITY") throw new Error("Invalid event");
  if (!context.selectedStoreConfig) throw new Error("Invalid state");
  const { identity, passphrase } = event;

  if (identity.id.length === 0)
    identity.id = await generateId();

  return addIdentity(context.selectedStoreConfig.name, identity, passphrase);
}

export const configState: MachineConfig<MainContext, any, MainEvents> = {
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
          actions: assign({ defaultStoreName: (_, event) => event.data }),
        }, {
          target: "show_stores",
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
          const { selectedStoreConfig } = context;
          if (!selectedStoreConfig) return Promise.resolve([]);
          return identities(selectedStoreConfig.name);
        },
        onDone: {
          target: "show_stores",
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
    show_stores: {
      on: {
        SELECT_STORE: {
          target: "fetch_identities",
          actions: assign({ selectedStoreConfig: (context, event) => context.storeConfigs.find(storeConfig => storeConfig.name == event.storeName) }),
        },
        SAVE_CONFIG: "save_config",
        ADD_IDENTITY: "add_identity",
        SET_DEFAULT_STORE: "set_default_store",
      },
    },
    save_config: {
      invoke: {
        src: saveConfigAction,
        onDone: {
          target: "fetch_store_configs",
          actions: assign({ selectedStoreConfig: (_, event) => event.data }),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    add_identity: {
      invoke: {
        src: addIdentityAction,
        onDone: "fetch_identities",
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    set_default_store: {
      invoke: {
        src: (_, event) => {
          if (event.type !== "SET_DEFAULT_STORE") return Promise.reject("Invalid event");
          return setDefaultStore(event.storeName)
        },
        onDone: "fetch_default_store",
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    error: {
      on: {
        CONFIRM_ERROR: "show_stores",
      },
    },
  },
};
