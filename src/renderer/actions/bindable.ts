import { Dispatch } from "redux";
import { bindBindableActions } from "../helpers/minithunk";
import { doLockStore, doUnlockStore, doSelectEntry, doUpdateListFilter, doSelectUp, doSelectDown } from "./store-actions";
import { doDismissError, doSecretToClipboard } from "./service-actions";
import { State } from "../reducers/state";

const bindableActions = {
  doDismissError,
  doLockStore,
  doUnlockStore,
  doSelectEntry,
  doSelectUp,
  doSelectDown,
  doUpdateListFilter,
  doSecretToClipboard,
}

type BindableActions = typeof bindableActions;

export type BoundActions = {
  [name in keyof BindableActions]: ReturnType<BindableActions[name]>
};

export function actionBinder(dispatch: Dispatch): BoundActions {
  return bindBindableActions<State, BoundActions>(dispatch, bindableActions)
}