import { Dispatch } from "redux";
import { bindBindableActions } from "../helpers/minithunk";
import { doLockStore, doUnlockStore, doSelectEntry, doUpdateListFilter } from "./store-actions";
import { doDismissError } from "./service-actions";
import { Actions } from "./actions";

const bindableActions = {
  doDismissError,
  doLockStore,
  doUnlockStore,
  doSelectEntry,
  doUpdateListFilter,
};

export type BoundActions = { [name in keyof typeof bindableActions]: ReturnType<typeof bindableActions[name]> };

export function actionBinder(dispatch: Dispatch<Actions>): BoundActions {
  return bindBindableActions<Actions, BoundActions>(dispatch, bindableActions);
}
