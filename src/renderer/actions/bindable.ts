import { Dispatch } from "redux";
import { bindBindableActions } from "../helpers/minithunk";
import { doLockStore, doUnlockStore, doSelectEntry } from "./store-actions";
import { doDismissError } from "./service-actions";
import { State } from "../reducers/state";

export type BoundActions = {
  doDismissError: () => void
  doLockStore: (store_name: string) => void
  doUnlockStore: (store_name: string, identity_id: string, passphrase: string) => void
  doSelectEntry: (store_name: string, secret_id: string) => void
}

export function actionBinder(dispatch: Dispatch): BoundActions {
  return bindBindableActions<State, BoundActions>(dispatch, {
    doDismissError,
    doLockStore,
    doUnlockStore,
    doSelectEntry,
  })
}