import { ServiceState, INITIAL_STATE } from "./state";
import { ServiceAction, ServiceActionCreators } from "../actions/service-action-creators";

export function serviceReducer(state: ServiceState = INITIAL_STATE.service, action: ServiceAction): ServiceState {
  switch (action.type) {
    case ServiceActionCreators.setError.type:
      return {
        ...state,
        error: action.payload,
        listStoresInProgress: false,
      }
    case ServiceActionCreators.listStoresStart.type:
      return {
        ...state,
        error: null,
        listStoresInProgress: true,
      };
    case ServiceActionCreators.listStoresDone.type:
      return {
        ...state,
        error: null,
        listStoresInProgress: false,
        stores: action.payload,
      };
    case ServiceActionCreators.selectStore.type:
      return {
        ...state,
        selectedStore: action.payload,
      }
    default:
      return state;
  }
}