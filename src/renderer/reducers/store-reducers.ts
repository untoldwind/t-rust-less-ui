import { StoreState, INITIAL_STATE } from "./state";
import { ServiceAction, ServiceActionCreators } from "../actions/service-action-creators";
import { StoreAction, StoreActionCreators } from "../actions/store-action-creators";

export function storeReducer(state: StoreState = INITIAL_STATE.store, action: ServiceAction | StoreAction): StoreState {
  switch (action.type) {
    case ServiceActionCreators.selectStore.type:
      return {
        ...state,
        identities: [],
        status: null,
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
    case StoreActionCreators.statusStart.type:
      return {
        ...state,
        getStatusinProgress: true,
      }
    case StoreActionCreators.statusDone.type:
      return {
        ...state,
        getStatusinProgress: false,
        status: action.payload,
      }
    default:
      return state;
  }
}