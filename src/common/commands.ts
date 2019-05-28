import { StoreConfig } from "./model";

export interface GetStoreConfig {
  get_store_config: string
}

export interface SetStoreConfig {
  set_store_config: StoreConfig
}

export interface SetDefaultStore {
  set_default_store: string
}

export interface Status {
  status: {
    store_name: string
  }
}

export interface ListIdentities {
  list_identities: {
    store_name: string
  }
}

export interface Unlock {
  unlock: {
    store_name: string
    identity_id: string
    passphrase: string
  }
}

export interface Lock {
  lock: {
    store_name: string
  }
}

export type Command = "list_stores"
  | GetStoreConfig
  | SetStoreConfig
  | "get_default_store"
  | SetDefaultStore
  | Status
  | ListIdentities
  | Unlock
  | Lock;
