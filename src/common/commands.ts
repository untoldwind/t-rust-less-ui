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
    status: string
}

export interface ListIdentities {
    list_identities: string
}

export type Command = "list_stores"
    | GetStoreConfig 
    | SetStoreConfig 
    | "get_default_store" 
    | SetDefaultStore
    | Status
    | ListIdentities;
