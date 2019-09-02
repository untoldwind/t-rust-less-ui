import { Dispatch } from "react-redux";

export type BindableActions<S, T> = {
  [name in keyof T]: (dispatch: Dispatch<S>) => T[name]
};

export function bindBindableActions<S, T extends { [name: string]: (...args: any[]) => void }>(dispatch: Dispatch<S>, actions: BindableActions<S, T>): T {
  const result : { [name: string]: (...args: any[]) => void } = {};
  for (const actionName in actions) {
    if (actions.hasOwnProperty(actionName)) {
      result[actionName] = (...args: any[]) => actions[actionName](dispatch)(...args);
    }
  }
  return result as T;
}
