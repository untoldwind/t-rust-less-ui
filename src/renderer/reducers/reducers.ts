import { combineReducers } from "redux";
import { State } from "./state";
import { navigationReducer } from "./navigation-reducers";
import { serviceReducer } from "./service-reducers";

export const reducers = combineReducers<State>({
    navigation: navigationReducer,
    service: serviceReducer,
});