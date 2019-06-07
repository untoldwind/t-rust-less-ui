import { ActionCreator } from "../helpers/action-creator";
import { Status, Identity, SecretList, Secret, SecretVersion, SecretListFilter } from "../../common/model";

export const StoreActionCreators = {
  setStatus: new ActionCreator<"SET_STATUS", Status>("SET_STATUS"),

  unlockStart: new ActionCreator<"UNLOCK_START", undefined>("UNLOCK_START"),
  unlockDone: new ActionCreator<"UNLOCK_DONE", undefined>("UNLOCK_DONE"),

  listIdentitiesStart: new ActionCreator<"LIST_IDENTITIES_START", undefined>("LIST_IDENTITIES_START"),
  listIdentitiesDone: new ActionCreator<"LIST_IDENTITIES_DONE", Identity[]>("LIST_IDENTITIES_DONE"),

  setListFilter: new ActionCreator<"SET_LIST_FILTER", SecretListFilter>("SET_LIST_FILTER"),
  listEntriesStart: new ActionCreator<"LIST_ENTRIES_START", undefined>("LIST_ENTRIES_START"),
  listEntriesDone: new ActionCreator<"LIST_ENTRIES_DONE", SecretList>("LIST_ENTRIES_DONE"),

  setCurrentSecret: new ActionCreator<"SET_CURRENT_SECRET", Secret>("SET_CURRENT_SECRET"),

  getSecretVersionStart: new ActionCreator<"GET_SECRET_VERSION_START", undefined>("GET_SECRET_VERSION_START"),
  getSecretVersionDone: new ActionCreator<"GET_SECRET_VERSION_DONE", SecretVersion>("GET_SECRET_VERSION_DONE"),
};

export type StoreAction = typeof StoreActionCreators[keyof typeof StoreActionCreators];
