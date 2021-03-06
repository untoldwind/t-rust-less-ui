import { StoreConfig, SecretListFilter } from "./model";

export interface GetStoreConfig {
  get_store_config: string
}

export interface SetStoreConfig {
  set_store_config: StoreConfig
}

export interface SetDefaultStore {
  set_default_store: string
}

export interface GetStatus {
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

export interface ListSecrets {
  list_secrets: {
    store_name: string
    filter: SecretListFilter
  }
}

export interface GetSecret {
  get_secret: {
    store_name: string
    secret_id: string
  }
}

export interface SecretToClipboard {
  secret_to_clipboard: {
    store_name: string
    secret_id: string
    properties: string[]
    display_name: string
  }
}

export type Command = "list_stores"
  | GetStoreConfig
  | SetStoreConfig
  | "get_default_store"
  | SetDefaultStore
  | GetStatus
  | ListIdentities
  | Unlock
  | Lock
  | ListSecrets
  | GetSecret
  | SecretToClipboard;
