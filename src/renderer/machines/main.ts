import { createMachine, interpret, assign } from "xstate";
import { LockedContext, LockedEvent, lockedState, LockedState } from "./locked";
import { UnlockedEvent, UnlockedContext, unlockedState, UnlockedState } from "./unlocked";
import { StatusMonitor } from "./status-monitor";
import { Identity } from "../../../native";
import { ConfigContext, ConfigEvent, ConfigState, configState } from "./config";

export type MainContext = LockedContext & UnlockedContext & ConfigContext & {
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
  initial: "locked",
  context: {
    storeConfigs: [],
    identities: [],
    secretFilter: {},
  },
  states: {
    locked: {
      ...lockedState,
    },
    unlocked: {
      invoke: {
        src: context => callback => {
          const { selectedStoreConfig } = context;
          if (!selectedStoreConfig) return () => { };
          return new StatusMonitor(callback, selectedStoreConfig.name, "UNLOCKED").shutdown;
        },
      },
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
