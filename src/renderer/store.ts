import { compose, createStore, applyMiddleware } from "redux";
import { reducers } from "./reducers/reducers";
import { INITIAL_STATE, State } from "./reducers/state";
import { bindActors } from "./helpers/bind-actor";
import { actors } from "./actions/actors";
import { Actions } from "./actions/actions";

declare namespace window {
  const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: <R>(a: R) => R
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

export const store = createStore<State, Actions, {}, {}>(reducers, INITIAL_STATE, composeEnhancers(applyMiddleware()));

bindActors(store, actors);