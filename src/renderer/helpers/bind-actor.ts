import { Store, Dispatch } from "redux";
import { debounce } from "./debounce";

export interface Actor<S> {
  (state: S, dispatch: Dispatch): void
}

function triggerActors<S>(store: Store<S>, actors: Actor<S>[]) {
  actors.forEach((actor) => actor(store.getState(), store.dispatch));
}

export function bindActors<S>(store: Store<S>, actors: Actor<S>[]) {
  const debouncedTrigger = debounce(triggerActors, 100);

  debouncedTrigger(store, actors);

  store.subscribe(() => {
    debouncedTrigger(store, actors);
  });
}
