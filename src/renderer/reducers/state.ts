import { Identity, Status, SecretListFilter, SecretList } from "../../common/model";
import { NavigationPage } from "../actions/navigation";
import { ServiceError } from "../../common/errors";

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
  status: Status | null
  getStatusinProgress: boolean
  listFilter: SecretListFilter
  list: SecretList | null
  listInProgress: boolean
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
    status: null,
    getStatusinProgress: false,
    listFilter: {},
    list: null,
    listInProgress: false,
  },
};