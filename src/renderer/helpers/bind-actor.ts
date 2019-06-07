import { Store, Dispatch } from "redux";

export interface Actor<S> {
  (state: S, dispatch: Dispatch): void
}

export function bindActors<S>(store: Store<S>, actors: Actor<S>[]) {
  let timeoutId: number | null = null;

  timeoutId = window.setTimeout(() => {
    timeoutId = null;
    actors.forEach((actor) => actor(store.getState(), store.dispatch));
  }, 100);

  store.subscribe(() => {
    if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        actors.forEach((actor) => actor(store.getState(), store.dispatch));
      }, 100);
    }
  });
}
