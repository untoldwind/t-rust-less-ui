import { ServiceError, Identity } from "../../common/model";
import { NavigationPage } from "../actions/navigation";

export interface NavigationState {
  page: NavigationPage
}

export interface ServiceState {
  error: ServiceError | null
  listStoresInProgress: boolean
  stores: string[]
  selectedStore: string | null
}

export interface StoreState {
  identities: Identity[]
  listIdentitiesInProgress: boolean
}

export interface State {
  navigation: NavigationState
  service: ServiceState
  store: StoreState
}

export const INITIAL_STATE: State = {
  navigation: {
    page: "UnlockStore",
  },
  service: {
    error: null,
    listStoresInProgress: false,
    stores: [],
    selectedStore: null,
  },
  store: {
    identities: [],
    listIdentitiesInProgress: false,
  },
};