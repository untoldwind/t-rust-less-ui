import { StoreConfig, Status, Identity, SecretList } from "./model";
import { ServiceError } from "./errors";

export interface ErrorResult {
  error: ServiceError
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

export interface IdentitiesResult {
  identities: Identity[]
}

export interface SecretListResult {
  secret_list: SecretList
}

export type CommandResult = "invalid"
  | "success"
  | ErrorResult
  | "empty"
  | BoolResult
  | StoreConfigResult
  | StringResult
  | StringListResult
  | StatusResult
  | IdentitiesResult
  | SecretListResult;

export function isError(result: CommandResult): result is ErrorResult {
  return typeof result === "object" && typeof (result as ErrorResult).error !== "undefined";
}

export function isString(result: CommandResult): result is StringResult {
  return typeof result === "object" && typeof (result as StringResult).string !== "undefined";
}

export function isStringList(result: CommandResult): result is StringListResult {
  return typeof result === "object" && typeof (result as StringListResult).string_list !== "undefined";
}

export function isStatus(result: CommandResult): result is StatusResult {
  return typeof result === "object" && typeof (result as StatusResult).status !== "undefined";
}

export function isIdentities(result: CommandResult): result is IdentitiesResult {
  return typeof result === "object" && typeof (result as IdentitiesResult).identities !== "undefined";
}

export function isSecretList(result: CommandResult): result is SecretListResult {
  return typeof result === "object" && typeof (result as SecretListResult).secret_list !== "undefined";
}
