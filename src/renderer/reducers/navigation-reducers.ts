import { NavigationState, INITIAL_STATE } from "./state";
import { NavigationAction, NavigationActionCreators } from "../actions/navigation";
import { StoreAction, StoreActionCreators } from "../actions/store-action-creators";

export function navigationReducer(state: NavigationState = INITIAL_STATE.navigation, action: NavigationAction | StoreAction): NavigationState {
  switch (action.type) {
    case NavigationActionCreators.navigateTo.type:
      return {
        ...state,
        page: action.payload,
      };
    case StoreActionCreators.setStatus.type:
      if (state.page !== "ListSecrets" && !action.payload.locked)
        return {
          ...state,
          page: "ListSecrets",
        }
      else if (state.page !== "UnlockStore" && action.payload.locked)
        return {
          ...state,
          page: "UnlockStore",
        }
      else
        return state;
    default:
      return state;
  }
}