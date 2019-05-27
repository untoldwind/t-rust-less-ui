import { Actor } from "../helpers/bind-actor";
import { State } from "../reducers/state";
import { Dispatch } from "redux";
import { doListStores } from "./service-actions";

export function ensureStoreList(state: State, dispatch: Dispatch) {
    if(state.navigation.page === "UnlockStore" && !state.service.listStoresInProgress && state.service.stores.length === 0) {
        doListStores(dispatch)();
    }
}

export function ensureIdentities(state: State, dispatch: Dispatch) {
    
}

export const actors: Actor<State>[] = [
    ensureStoreList,
    ensureIdentities,
];