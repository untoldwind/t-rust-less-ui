import { NavigationState, INITIAL_STATE } from "./state";
import { NavigationAction, NavigationActionCreators } from "../actions/navigation";

export function navigationReducer(state: NavigationState = INITIAL_STATE.navigation, action: NavigationAction): NavigationState {
  switch (action.type) {
    case NavigationActionCreators.navigateTo.type:
      return {
        ...state,
        page: action.payload,
      };
    default:
      return state;
  }
}