import { Actor } from "../helpers/bind-actor";
import { State } from "../reducers/state";
import { Dispatch } from "redux";
import { doListStores, doSelectStore } from "./service-actions";
import { doListIdentities } from "./store-actions";

export function ensureStoreList(state: State, dispatch: Dispatch) {
  if (state.navigation.page === "UnlockStore" && !state.service.listStoresInProgress && state.service.stores.length === 0) {
    doListStores(dispatch)();
  }
}

export function ensureIdentities(state: State, dispatch: Dispatch) {
  if (state.service.stores.length > 0 && !state.service.selectedStore) {
    doSelectStore(dispatch)(state.service.stores[0])
    doListIdentities(dispatch)(state.service.stores[0]);
  } else if (state.service.selectedStore && !state.store.listIdentitiesInProgress && state.store.identities.length == 0) {
    doListIdentities(dispatch)(state.service.selectedStore);
  }
}

export const actors: Actor<State>[] = [
  ensureStoreList,
  ensureIdentities,
];