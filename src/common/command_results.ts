import { StoreConfig, Status } from "./model";

export interface ErrorResult {
    error: {
        error: any
        display: string
    }
}

export interface BoolResult {
    bool: boolean
}

export interface StoreConfigResult {
    store_config: StoreConfig
}

export interface StringResult {
    string: string
}

export interface StringListResult {
    string_list: string[]
}

export interface StatusResult {
    status: Status
}

export type CommandResult = "invalid"
    | "success"
    | ErrorResult
    | "empty"
    | BoolResult
    | StoreConfigResult
    | StringResult
    | StringListResult
    | StatusResult;

