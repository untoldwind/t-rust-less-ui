import { createMachine, interpret, assign } from "xstate";
import { LockedContext, LockedEvent, lockedState, LockedState } from "./locked";
import { UnlockedEvent, UnlockedContext, unlockedState, UnlockedState } from "./unlocked";
import { StatusMonitor } from "./status-monitor";
import { Identity } from "../../../native";

export type MainContext = LockedContext & UnlockedContext & {
}

export type MainEvents = LockedEvent | UnlockedEvent
  | { type: "STORE_LOCKED", storeName: string }
  | { type: "STORE_UNLOCKED", storeName: string, identity: Identity }
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
  | LockedState
  | UnlockedState

const mainMachine = createMachine<MainContext, MainEvents, MainState>({
  id: "main",
  initial: "locked",
  context: {
    storeNames: [],
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
          const { selectedStore } = context;
          if (!selectedStore) return () => { };
          return new StatusMonitor(callback, selectedStore, "UNLOCKED").shutdown;
        },
      },
      ...unlockedState,
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
    STORE_LOCKED: "locked",
  },
});

export const mainInterpreter = interpret(mainMachine, { devTools: true });
