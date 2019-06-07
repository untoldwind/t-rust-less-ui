import { StoreState, INITIAL_STATE } from "./state";
import { ServiceAction, ServiceActionCreators } from "../actions/service-action-creators";
import { StoreAction, StoreActionCreators } from "../actions/store-action-creators";

export function storeReducer(state: StoreState = INITIAL_STATE.store, action: ServiceAction | StoreAction): StoreState {
  switch (action.type) {
    case ServiceActionCreators.selectStore.type:
      return INITIAL_STATE.store;
    case StoreActionCreators.unlockStart.type:
      return {
        ...state,
        unlockInProgress: true,
      };
    case StoreActionCreators.unlockDone.type:
      return {
        ...state,
        unlockInProgress: false,
      };
    case StoreActionCreators.listIdentitiesStart.type:
      return {
        ...state,
        listIdentitiesInProgress: true,
      };
    case StoreActionCreators.listIdentitiesDone.type:
      return {
        ...state,
        listIdentitiesInProgress: false,
        identities: action.payload,
      };
    case StoreActionCreators.setStatus.type:
      return {
        ...state,
        status: action.payload,
      };
    case StoreActionCreators.setListFilter.type:
      return {
        ...state,
        listFilter: action.payload,
      };
    case StoreActionCreators.listEntriesStart.type:
      return {
        ...state,
        listInProgress: true,
      };
    case StoreActionCreators.listEntriesDone.type:
      let currentSecret = state.currentSecret;

      if (currentSecret) {
        const secretId = currentSecret.id;
        if (!action.payload.entries.find(match => match.entry.id === secretId)) {
          currentSecret = null;
        }
      }

      return {
        ...state,
        listInProgress: false,
        list: action.payload,
        currentSecret,
      };
    case StoreActionCreators.setCurrentSecret.type:
      return {
        ...state,
        currentSecret: action.payload,
      };
    default:
      return state;
  }
}