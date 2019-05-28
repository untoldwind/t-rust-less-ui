import { Dispatch } from "redux";
import { bindBindableActions } from "../helpers/minithunk";
import { doLockStore, doUnlockStore } from "./store-actions";
import { State } from "../reducers/state";

export type BoundActions = {
  doLockStore: (store_name: string) => void
  doUnlockStore: (store_name: string, identity_id: string, passphrase: string) => void
}

export function actionBinder(dispatch: Dispatch): BoundActions {
  return bindBindableActions<State, BoundActions>(dispatch, {
    doLockStore,
    doUnlockStore,
  })
}