import { Dispatch } from "redux";

export type BindableActions<T> = {
  [name in keyof T]: (dispatch: Dispatch) => T[name]
};

export function bindBindableActions<S, T extends { [name: string]: (...args: any[]) => void }>(dispatch: Dispatch, actions: BindableActions<T>): T {
  const result: { [name: string]: (...args: any[]) => void } = {};
  for (const actionName in actions) {
    if (actions.hasOwnProperty(actionName)) {
      result[actionName] = (...args: any[]) => actions[actionName](dispatch)(...args);
    }
  }
  return result as T;
}
