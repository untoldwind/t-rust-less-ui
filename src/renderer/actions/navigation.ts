import { ActionCreator } from "../helpers/action-creator";

export type NavigationPage = "Initializing" | "UnlockStore" | "ListSecrets";


export const NavigationActionCreators = {
  navigateTo: new ActionCreator<"NAVIGATE_TO", NavigationPage>("NAVIGATE_TO"),
};

export type NavigationAction = typeof NavigationActionCreators[keyof typeof NavigationActionCreators];
export type NavigationActionTypes = ReturnType<NavigationAction["create"]>;
