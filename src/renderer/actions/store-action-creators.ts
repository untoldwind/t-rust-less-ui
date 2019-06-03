import { ActionCreator } from "../helpers/action-creator";
import { Status, Identity, SecretList, Secret, SecretVersion } from "../../common/model";

export const StoreActionCreators = {
  statusStart: new ActionCreator<"STATUS_START", undefined>("STATUS_START"),
  statusDone: new ActionCreator<"STATUS_DONE", Status>("STATUS_DONE"),

  listIdentitiesStart: new ActionCreator<"LIST_IDENTITIES_START", undefined>("LIST_IDENTITIES_START"),
  listIdentitiesDone: new ActionCreator<"LIST_IDENTITIES_DONE", Identity[]>("LIST_IDENTITIES_DONE"),

  listEntriesStart: new ActionCreator<"LIST_ENTRIES_START", undefined>("LIST_ENTRIES_START"),
  listEntriesDone: new ActionCreator<"LIST_ENTRIES_DONE", SecretList>("LIST_ENTRIES_DONE"),

  getSecretStart: new ActionCreator<"GET_SECRET_START", undefined>("GET_SECRET_START"),
  getSecretDone: new ActionCreator<"GET_SECRET_DONE", Secret>("GET_SECRET_DONE"),

  getSecretVersionStart: new ActionCreator<"GET_SECRET_VERSION_START", undefined>("GET_SECRET_VERSION_START"),
  getSecretVersionDone: new ActionCreator<"GET_SECRET_VERSION_DONE", SecretVersion>("GET_SECRET_VERSION_DONE"),
};

export type StoreAction = typeof StoreActionCreators[keyof typeof StoreActionCreators];
