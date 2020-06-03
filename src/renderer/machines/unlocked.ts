import { MachineConfig, assign, send } from "xstate"
import { MainEvents, MainContext } from "./main"
import { SecretListFilter, SecretList, Secret, SecretVersion } from "../../../native"
import { listSecrets, lock, getSecret, getSecretVersion } from "./backend-neon"

export interface UnlockedContext {
  secretFilter: SecretListFilter
  secretList?: SecretList
  selectedSecretId?: string
  currentSecret?: Secret
  currentBlockId?: string
  currentSecretVersion?: SecretVersion
  errorMessage?: string
  autolockIn?: number
  autolockTimeout?: number
}

export type UnlockedEvent =
  | { type: "SET_SECRET_FILTER", secretFilter: SecretListFilter }
  | { type: "UPDATE_AUTOLOCK_IN", autoLockIn: number, autoLockTimeout: number }
  | { type: "SELECT_SECRET", selectedSecretId: string }
  | { type: "SELECT_SECRET_VERSION", blockId: string }
  | { type: "SELECT_PREVIOUS" }
  | { type: "SELECT_NEXT" }
  | { type: "STORE_SECRET_VERSION", secretVersion: SecretVersion }
  | { type: "LOCK" }

export type UnlockedState =
  | {
    value: "unlocked.select_secret"
    context: MainContext & {
      secretList: SecretList
    }
  }
  | {
    value: "unlocked.fetch_secret"
    context: MainContext & {
      secretList: SecretList
    }
  }
  | {
    value: "unlocked.fetch_secret_version"
    context: MainContext & {
      secretList: SecretList
      currentSecret: Secret
      currentBlockId: string
    }
  }
  | {
    value: "unlocked.display_secret"
    context: MainContext & {
      secretList: SecretList
      currentSecret: Secret
      currentBlockId: string
      currentSecretVersion: SecretVersion
    }
  }
  | {
    value: "unlocked.error"
    context: MainContext & {
      errorMessage: string
    }
  }

export const unlockedState: MachineConfig<MainContext, any, MainEvents> = {
  initial: "fetch_secret_list",
  states: {
    fetch_secret_list: {
      invoke: {
        src: context => {
          const { selectedStore, secretFilter } = context;
          if (!selectedStore) return Promise.reject("Invalid state");
          return listSecrets(selectedStore, secretFilter);
        },
        onDone: {
          target: "select_secret",
          actions: assign((_, event) => ({
            secretList: event.data,
            selectedSecretId: undefined,
            currentSecret: undefined,
            currentBlockId: undefined,
            currentSecretVersion: undefined,
          })),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    select_secret: {
      on: {
        SELECT_SECRET: {
          target: "fetch_secret",
          actions: assign({ selectedSecretId: (_, event) => event.selectedSecretId }),
        },
        SELECT_NEXT: {
          cond: context => typeof context.secretList === "object" && context.secretList.entries.length > 0,
          target: "fetch_secret",
          actions: assign({ selectedSecretId: context => context.secretList?.entries[0].entry.id }),
        },
      },
    },
    fetch_secret: {
      invoke: {
        src: context => {
          const { selectedStore, selectedSecretId } = context;
          if (!selectedStore || !selectedSecretId) return Promise.reject("Invalid state");
          return getSecret(selectedStore, selectedSecretId);
        },
        onDone: {
          target: "display_secret",
          actions: assign((_, event) => ({
            currentSecret: event.data,
            currentBlockId: event.data.current_block_id,
            currentSecretVersion: event.data.current,
          })),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    fetch_secret_version: {
      invoke: {
        src: (context, event) => {
          const { selectedStore, selectedSecretId, currentBlockId } = context;
          if (!selectedStore || !selectedSecretId || !currentBlockId) return Promise.reject("Invalid state");

          return getSecretVersion(selectedStore, currentBlockId);
        },
        onDone: {
          target: "display_secret",
          actions: assign({ currentSecretVersion: (_, event) => event.data }),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    display_secret: {
      on: {
        SELECT_SECRET: {
          target: "fetch_secret",
          actions: assign({ selectedSecretId: (_, event) => event.selectedSecretId }),
        },
        SELECT_SECRET_VERSION: {
          target: "fetch_secret_version",
          actions: assign((_, event) => ({
            currentBlockId: event.blockId,
            currentSecretVersion: undefined,
          })),
        },
        SELECT_NEXT: {
          cond: context => {
            const idx = context.secretList?.entries.findIndex(match => match.entry.id === context.selectedSecretId);

            return typeof idx === "number" && typeof context.secretList === "object" && idx + 1 < context.secretList.entries.length;
          },
          target: "fetch_secret",
          actions: assign({
            selectedSecretId: context => {
              if (typeof context.secretList !== "object") return context.selectedIdentityId;
              const idx = context.secretList.entries.findIndex(match => match.entry.id === context.selectedSecretId);

              return context.secretList.entries[idx + 1].entry.id;
            },
          }),
        },
        SELECT_PREVIOUS: {
          cond: context => {
            const idx = context.secretList?.entries.findIndex(match => match.entry.id === context.selectedSecretId);

            return typeof idx === "number" && typeof context.secretList === "object" && idx > 0;
          },
          target: "fetch_secret",
          actions: assign({
            selectedSecretId: context => {
              if (typeof context.secretList !== "object") return context.selectedIdentityId;
              const idx = context.secretList.entries.findIndex(match => match.entry.id === context.selectedSecretId);

              return context.secretList.entries[idx - 1].entry.id;
            },
          }),
        },
      },
    },
    edit_secret_version: {
      on: {
        STORE_SECRET_VERSION: {
          target: "store_secret_version",
          actions: assign({ currentSecretVersion: (_, event) => event.secretVersion }),
        },
      },
    },
    store_secret_version: {

    },
    lock_store: {
      invoke: {
        src: context => {
          const { selectedStore } = context;
          if (!selectedStore) return Promise.reject("Invalid state");
          return lock(selectedStore);
        },
        onDone: {
          actions: send({ type: "STORE_LOCKED" }),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    error: {
      on: {
        CONFIRM_ERROR: "fetch_secret_list",
      },
    },
  },
  on: {
    LOCK: ".lock_store",
    SET_SECRET_FILTER: {
      target: ".fetch_secret_list",
      actions: assign({ secretFilter: (_, event) => event.secretFilter }),
    },
    UPDATE_AUTOLOCK_IN: {
      actions: assign((_, event) => ({
        autolockIn: event.autoLockIn,
        autolockTimeout: event.autoLockTimeout,
      })),
    },
  },
}