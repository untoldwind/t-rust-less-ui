import { MachineConfig, assign, send } from "xstate"
import { MainEvents, MainContext } from "./main"
import { SecretListFilter, SecretList, Secret, SecretVersion, SecretType, Identity, SecretEntryMatch } from "../../../native"
import { listSecrets, lock, getSecret, getSecretVersion, addSecretVersion } from "./backend-neon"
import { DisplaySecretContext, displaySecretState, DisplaySecretEvent } from "./display-secret"
import { editSecretState, EditSecretContext, EditSecretState, EditSecretEvent } from "./edit-secret"
import moment from "moment";

export type UnlockedContext = DisplaySecretContext & EditSecretContext & {
  secretFilter: SecretListFilter
  secretList?: SecretList
  selectedSecretId?: string
  currentSecret?: Secret
  currentBlockId?: string
  currentSecretVersion?: SecretVersion
  errorMessage?: string
  selectedIdentity?: Identity
  autolockIn?: number
  autolockTimeout?: number
}

export type UnlockedEvent = DisplaySecretEvent | EditSecretEvent
  | { type: "SET_SECRET_FILTER", secretFilter: SecretListFilter }
  | { type: "UPDATE_AUTOLOCK_IN", autoLockIn: number, autoLockTimeout: number }
  | { type: "SELECT_SECRET", selectedSecretId: string }
  | { type: "SELECT_SECRET_VERSION", blockId: string }
  | { type: "SELECT_PREVIOUS" }
  | { type: "SELECT_NEXT" }
  | { type: "CREATE_SECRET", secretType: SecretType }
  | { type: "NEW_SECRET_VERSION" }
  | { type: "STORE_SECRET_VERSION" }
  | { type: "ARCHIVE_SECRET" }
  | { type: "UNARCHIVE_SECRET" }
  | { type: "LOCK" }

export type UnlockedState = EditSecretState
  | {
    value: "unlocked.select_secret"
    context: MainContext & {
      secretList: SecretList
      selectedIdentity: Identity
    }
  }
  | {
    value: "unlocked.fetch_secret"
    context: MainContext & {
      secretList: SecretList
      selectedIdentity: Identity
    }
  }
  | {
    value: "unlocked.fetch_secret_version"
    context: MainContext & {
      secretList: SecretList
      currentSecret: Secret
      currentBlockId: string
      selectedIdentity: Identity
    }
  }
  | {
    value: "unlocked.edit_secret_version"
    context: MainContext & {
      secretList: SecretList
    }
  }
  | {
    value: "unlocked.display_secret"
    context: MainContext & {
      secretList: SecretList
      currentSecret: Secret
      currentBlockId: string
      currentSecretVersion: SecretVersion
      selectedIdentity: Identity
    }
  }
  | {
    value: "unlocked.error"
    context: MainContext & {
      errorMessage: string
      selectedIdentity: Identity
    }
  }

export const unlockedState: MachineConfig<MainContext, any, MainEvents> = {
  initial: "fetch_secret_list",
  states: {
    fetch_secret_list: {
      invoke: {
        src: ({ selectedStoreConfig, secretFilter }) => {
          if (!selectedStoreConfig) return Promise.reject("Invalid state");
          return listSecrets(selectedStoreConfig.name, secretFilter);
        },
        onDone: [{
          target: "fetch_secret",
          cond: (context, event) => event.data.entries.some((match: SecretEntryMatch) => match.entry.id === context.selectedSecretId),
          actions: assign((_, event) => ({
            secretList: event.data,
            currentSecret: undefined,
            currentBlockId: undefined,
            currentSecretVersion: undefined,
          })),
        }, {
          target: "select_secret",
          actions: assign((_, event) => ({
            secretList: event.data,
            selectedSecretId: undefined,
            currentSecret: undefined,
            currentBlockId: undefined,
            currentSecretVersion: undefined,
          })),
        }],
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
        CREATE_SECRET: "edit_secret_version",
      },
    },
    fetch_secret: {
      invoke: {
        src: ({ selectedStoreConfig, selectedSecretId }) => {
          if (!selectedStoreConfig || !selectedSecretId) return Promise.reject("Invalid state");
          return getSecret(selectedStoreConfig.name, selectedSecretId);
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
        src: ({ selectedStoreConfig, selectedSecretId, currentBlockId }) => {
          if (!selectedStoreConfig || !selectedSecretId || !currentBlockId) return Promise.reject("Invalid state");

          return getSecretVersion(selectedStoreConfig.name, currentBlockId);
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
      ...displaySecretState,
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
          cond: ({ secretList, selectedSecretId }) => {
            const idx = secretList?.entries.findIndex(match => match.entry.id === selectedSecretId);

            return typeof idx === "number" && typeof secretList === "object" && idx + 1 < secretList.entries.length;
          },
          target: "fetch_secret",
          actions: assign({
            selectedSecretId: ({ secretList, selectedSecretId }) => {
              if (typeof secretList !== "object") return selectedSecretId;
              const idx = secretList.entries.findIndex(match => match.entry.id === selectedSecretId);

              return secretList.entries[idx + 1].entry.id;
            },
          }),
        },
        SELECT_PREVIOUS: {
          cond: ({ secretList, selectedSecretId }) => {
            const idx = secretList?.entries.findIndex(match => match.entry.id === selectedSecretId);

            return typeof idx === "number" && typeof secretList === "object" && idx > 0;
          },
          target: "fetch_secret",
          actions: assign({
            selectedSecretId: context => {
              if (typeof context.secretList !== "object") return context.selectedSecretId;
              const idx = context.secretList.entries.findIndex(match => match.entry.id === context.selectedSecretId);

              return context.secretList.entries[idx - 1].entry.id;
            },
          }),
        },
        CREATE_SECRET: "edit_secret_version",
        NEW_SECRET_VERSION: "edit_secret_version",
        ARCHIVE_SECRET: "archive_secret",
        UNARCHIVE_SECRET: "unarchive_secret",
      },
    },
    edit_secret_version: {
      ...editSecretState,
      on: {
        STORE_SECRET_VERSION: "store_secret_version",
        SELECT_SECRET: {
          target: "fetch_secret",
          actions: assign({ selectedSecretId: (_, event) => event.selectedSecretId }),
        },
        ABORT_EDIT: [{
          target: "display_secret",
          cond: context => typeof context.currentSecretVersion === "object",
        }, {
          target: "select_secret",
          cond: context => typeof context.currentSecretVersion !== "object",
        }],
      },
    },
    store_secret_version: {
      invoke: {
        src: ({ selectedStoreConfig, editSecretVersion }) => {
          if (!selectedStoreConfig || !editSecretVersion) return Promise.reject("invalid state");
          return addSecretVersion(selectedStoreConfig.name, editSecretVersion)
        },
        onDone: {
          target: "fetch_secret_list",
          actions: assign({ selectedSecretId: context => context.editSecretVersion?.secret_id }),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    archive_secret: {
      invoke: {
        src: ({ selectedStoreConfig, currentSecret }) => {
          if (!selectedStoreConfig || !currentSecret) return Promise.reject("invalid state");
          return addSecretVersion(selectedStoreConfig.name, {
            ...currentSecret.current,
            timestamp: moment().format(),
            deleted: true,
          });
        },
        onDone: {
          target: "fetch_secret_list",
          actions: assign({ selectedSecretId: context => context.editSecretVersion?.secret_id }),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    unarchive_secret: {
      invoke: {
        src: ({ selectedStoreConfig, currentSecret }) => {
          if (!selectedStoreConfig || !currentSecret) return Promise.reject("invalid state");
          return addSecretVersion(selectedStoreConfig.name, {
            ...currentSecret.current,
            timestamp: moment().format(),
            deleted: false,
          });
        },
        onDone: {
          target: "fetch_secret_list",
          actions: assign({ selectedSecretId: context => context.editSecretVersion?.secret_id }),
        },
        onError: {
          target: "error",
          actions: assign({ errorMessage: (_, event) => event.data }),
        },
      },
    },
    lock_store: {
      invoke: {
        src: ({ selectedStoreConfig }) => {
          if (!selectedStoreConfig) return Promise.reject("Invalid state");
          return lock(selectedStoreConfig.name);
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
    refetch_secret_list: {
      // This ensures that fetch_secret_list is triggered even if a previous fetch_secret_list is still in progress
      // This might happend is the secret_list_filter is changed very quickly
      always: "fetch_secret_list",
    },
  },
  on: {
    LOCK: ".lock_store",
    SET_SECRET_FILTER: {
      target: ".refetch_secret_list",
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