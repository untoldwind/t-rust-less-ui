import { createMachine, interpret, assign } from "xstate";
import { LockedContext, LockedEvent, lockedState, LockedState } from "./locked";
import { UnlockedEvent, UnlockedContext, unlockedState, UnlockedState } from "./unlocked";
import { StatusMonitor } from "./status-monitor";
import { ConfigContext, ConfigEvent, ConfigState, configState } from "./config";
import { AppVersion, getAppVersion, upsertStoreConfig, Identity } from "./backend-tauri";

export type MainContext = LockedContext & UnlockedContext & ConfigContext & {
  appVersion: AppVersion
}

export type MainEvents = LockedEvent | UnlockedEvent | ConfigEvent
  | { type: "STORE_LOCKED", storeName: string }
  | { type: "STORE_UNLOCKED", storeName: string, identity: Identity }
  | { type: "OPEN_CONFIG" }
  | { type: "CONFIRM_ERROR" }

type MainState =
  | {
    value: "locked"
    context: MainContext
  }
  | {
    value: "unlocked"
    context: MainContext & {
      unlockedIdentity: Identity
      autolockIn: number
      autolockTimeout: number
    }
  }
  | {
    value: "config"
    context: MainContext
  }
  | LockedState
  | UnlockedState
  | ConfigState

const mainMachine = createMachine<MainContext, MainEvents, MainState>({
  id: "main",
  initial: "initial",
  context: {
    storeConfigs: [],
    identities: [],
    secretFilter: {},
    appVersion: { version: "", tauriVersion: "" },
  },
  states: {
    initial: {
      invoke: {
        src: getAppVersion,
        onDone: {
          target: "locked",
          actions: assign({ appVersion: (_, event) => event.data }),
        },
        onError: "locked",
      },
    },
    locked: {
      ...lockedState,
    },
    unlocked: {
      invoke: [{
        src: ({ selectedStoreConfig, unlockedIdentity }) => {
          if (selectedStoreConfig && unlockedIdentity && selectedStoreConfig.default_identity_id !== unlockedIdentity.id)
            return upsertStoreConfig({
              ...selectedStoreConfig,
              default_identity_id: unlockedIdentity.id,
            });
          return Promise.resolve()
        },
      }, {
        src: context => callback => {
          const { selectedStoreConfig } = context;
          if (!selectedStoreConfig) return () => { };
          return new StatusMonitor(callback, selectedStoreConfig.name, "UNLOCKED").shutdown;
        },
      }],
      ...unlockedState,
    },
    config: {
      ...configState,
    },
  },
  on: {
    STORE_UNLOCKED: {
      target: "unlocked",
      actions: assign((_, event) => ({
        secretFilter: { type: "login" },
        selectedStore: event.storeName,
        unlockedIdentity: event.identity,
        autolockIn: 300,
        autolockTimeout: 300,
      })),
    },
    STORE_LOCKED: {
      target: "locked",
      actions: assign((_, event) => ({
        secretFilter: { type: "login" },
        selectedStore: event.storeName,
        unlockedIdentity: undefined,
        currentSecret: undefined,
        currentSecretVersion: undefined,
        currentBlockId: undefined,
        secretList: undefined,
        selectedSecretId: undefined,
        autolockIn: undefined,
        autolockTimeout: undefined,
      })),
    },
    OPEN_CONFIG: "config",
    CLOSE_CONFIG: "locked",
  },
});

export const mainInterpreter = interpret(mainMachine, { devTools: true });
