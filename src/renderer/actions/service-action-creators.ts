import { ActionCreator } from "../helpers/action-creator";
import { ServiceError } from "../../common/errors";

export const ServiceActionCreators = {
  setError: new ActionCreator<"SERVICE_ERROR", ServiceError>("SERVICE_ERROR"),
  dismissError: new ActionCreator<"SERVICE_DISMISS_ERROR", undefined>("SERVICE_DISMISS_ERROR"),

  listStoresStart: new ActionCreator<"LIST_STORES_START", undefined>("LIST_STORES_START"),
  listStoresDone: new ActionCreator<"LIST_STORES_DONE", string[]>("LIST_STORES_DONE"),

  selectStore: new ActionCreator<"SELECT_STORE", string>("SELECT_STORE"),
};

export type ServiceAction = typeof ServiceActionCreators[keyof typeof ServiceActionCreators];
export type ServiceActionTypes = ReturnType<ServiceAction["create"]>;