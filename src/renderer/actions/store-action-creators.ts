import { ActionCreator } from "../helpers/action-creator";
import { Status, Identity } from "../../common/model";

export const StoreActionCreators = {
  statusStart: new ActionCreator<"STATUS_START", undefined>("STATUS_START"),
  statusDone: new ActionCreator<"STATUS_DONE", Status>("STATUS_DONE"),

  listIdentitiesStart: new ActionCreator<"LIST_IDENTITIES_START", undefined>("LIST_IDENTITIES_START"),
  listIdentitiesDone: new ActionCreator<"LIST_IDENTITIES_DONE", Identity[]>("LIST_IDENTITIES_DONE"),
};

export type StoreAction = typeof StoreActionCreators[keyof typeof StoreActionCreators];
