import { ActionCreator } from "../helpers/action-creator";

export type NavigationPage = "UnlockStore" | "ListSecrets";


export const NavigationActionCreators = {
  navigateTo: new ActionCreator<"NAVIGATE_TO", NavigationPage>("NAVIGATE_TO"),
};

export type NavigationAction = typeof NavigationActionCreators[keyof typeof NavigationActionCreators];
