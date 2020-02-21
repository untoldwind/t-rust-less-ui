import { NavigationActionTypes } from "./navigation";
import { ServiceActionTypes } from "./service-action-creators";
import { StoreActionTypes } from "./store-action-creators";

export type Actions = ServiceActionTypes | StoreActionTypes | NavigationActionTypes;
