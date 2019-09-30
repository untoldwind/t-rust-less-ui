import { Identity, Status, SecretListFilter, SecretList, Secret } from "../../common/model";
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
  unlockInProgress: boolean
  identities: Identity[]
  listIdentitiesInProgress: boolean
  status: Status | null
  listFilter: SecretListFilter
  list: SecretList | null
  listInProgress: boolean
  currentSecret: Secret | null
}

export interface State {
  navigation: NavigationState
  service: ServiceState
  store: StoreState
}

export const INITIAL_STATE: State = {
  navigation: {
    page: "Initializing",
  },
  service: {
    error: null,
    listStoresInProgress: false,
    stores: [],
    selectedStore: null,
  },
  store: {
    unlockInProgress: false,
    identities: [],
    listIdentitiesInProgress: false,
    status: null,
    listFilter: {
      type: "login",
    },
    list: null,
    listInProgress: false,
    currentSecret: null,
  },
};