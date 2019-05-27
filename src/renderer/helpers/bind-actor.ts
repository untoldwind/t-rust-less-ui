import { Store, Dispatch } from "redux";

export interface Actor<S> {
  (state: S, dispatch: Dispatch): void
}

export function bindActors<S>(store: Store<S>, actors: Actor<S>[]) {
  let acting = false;

  actors.forEach((actor) => actor(store.getState(), store.dispatch));

  store.subscribe(() => {
    if (!acting) {
      acting = true;
      actors.forEach((actor) => actor(store.getState(), store.dispatch));
      acting = false;
    }
  });
}
