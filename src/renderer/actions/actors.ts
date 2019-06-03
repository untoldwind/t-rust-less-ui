import { Actor } from "../helpers/bind-actor";
import { State } from "../reducers/state";
import { Dispatch } from "redux";
import { doListStores, doGetDefaultStore } from "./service-actions";
import { doListIdentities, doGetStatus } from "./store-actions";

function ensureStoreList(state: State, dispatch: Dispatch) {
  if (state.navigation.page === "UnlockStore" && !state.service.listStoresInProgress && state.service.stores.length === 0) {
    doListStores(dispatch)();
  }
}

function ensureIdentities(state: State, dispatch: Dispatch) {
  if (state.service.stores.length > 0 && !state.service.selectedStore) {
    doGetDefaultStore(dispatch)(state.service.stores[0]);
  } else if (state.service.selectedStore && !state.store.listIdentitiesInProgress && state.store.identities.length == 0) {
    doListIdentities(dispatch)(state.service.selectedStore);
  }
}

function ensureStatus(state: State, dispatch: Dispatch) {
  if (state.service.selectedStore && !state.store.getStatusinProgress && !state.store.status) {
    doGetStatus(dispatch)(state.service.selectedStore);
  }
}

class UpdateSecretList {

  trigger(state: State, dispatch: Dispatch) {
    if (!state.service.selectedStore || !state.store.status || state.store.status.locked) return;


  }
}

export const actors: Actor<State>[] = [
  ensureStoreList,
  ensureIdentities,
  ensureStatus,
  new UpdateSecretList().trigger,
];