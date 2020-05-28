import { SecretListFilter } from "../../native"

export type NeonCommand =
  | {
    type: "list-stores"
  }
  | {
    type: "get-default-store"
  }
  | {
    type: "status"
    storeName: string
  }
  | {
    type: "identities"
    storeName: string
  }
  | {
    type: "lock",
    storeName: string
  }
  | {
    type: "unlock"
    storeName: string
    identityId: string
    passphrase: string
  }
  | {
    type: "list-secrets"
    storeName: string
    filter: SecretListFilter
  }
  | {
    type: "get-secret",
    storeName: string
    secretId: string
  }

export type NeonResult<T> =
  | {
    result: "ok"
    value: T
  }
  | {
    result: "error"
    error: string
  }
