import { Dispatch } from "redux";
import { bindBindableActions } from "../helpers/minithunk";
import { doLockStore, doUnlockStore, doSelectEntry, doUpdateListFilter, doSelectUp, doSelectDown } from "./store-actions";
import { doDismissError, doSecretToClipboard } from "./service-actions";
import { Actions } from "./actions";

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

export type BoundActions = { [name in keyof typeof bindableActions]: ReturnType<typeof bindableActions[name]> };

export function actionBinder(dispatch: Dispatch<Actions>): BoundActions {
  return bindBindableActions<Actions, BoundActions>(dispatch, bindableActions)
}