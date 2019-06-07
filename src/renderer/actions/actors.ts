import { Actor } from "../helpers/bind-actor";
import { State } from "../reducers/state";
import { Dispatch } from "redux";
import { doListStores, doGetDefaultStore } from "./service-actions";
import { doListIdentities, doGetStatus, doUpdateSecretList } from "./store-actions";
import { SecretListFilter } from "../../common/model";
import { bind } from "decko";

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

class UpdateStatus {
  private intervalId: number | null = null;

  @bind
  trigger(state: State, dispatch: Dispatch) {
    if (state.service.selectedStore && !state.store.status && !this.intervalId) {
      const store = state.service.selectedStore;

      doGetStatus(dispatch)(store);
      this.intervalId = window.setInterval(() => {
        doGetStatus(dispatch)(store);
      }, 1000);
    } else if (!state.service.selectedStore && this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }
}

class UpdateSecretList {
  private lastStore: string | null = null;
  private lastFilter: SecretListFilter | null = null;

  @bind
  trigger(state: State, dispatch: Dispatch) {
    if (!state.service.selectedStore || !state.store.status || state.store.status.locked) return;

    if (state.service.selectedStore !== this.lastStore || state.store.listFilter !== this.lastFilter) {
      doUpdateSecretList(dispatch)(state.service.selectedStore, state.store.listFilter);
      this.lastStore = state.service.selectedStore;
      this.lastFilter = state.store.listFilter;
    }
  }
}

export const actors: Actor<State>[] = [
  ensureStoreList,
  ensureIdentities,
  new UpdateStatus().trigger,
  new UpdateSecretList().trigger,
];