import { Action, Dispatch } from "redux";


export type BindableActions<S extends Action, T> = {
  [name in keyof T]: (dispatch: Dispatch<S>) => T[name]
};

export function bindBindableActions<S extends Action, T extends { [name: string]: (...args: any[]) => void }>(dispatch: Dispatch<S>, actions: BindableActions<S, T>): T {
  const result: { [name: string]: (...args: any[]) => void } = {};
  for (const actionName in actions) {
    const stringActionName: string = actionName
    if (actions.hasOwnProperty(actionName)) {
      result[stringActionName] = (...args: any[]) => actions[actionName](dispatch)(...args);
    }
  }
  return result as T;
}
