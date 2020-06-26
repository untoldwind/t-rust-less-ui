import { SecretListFilter, SecretVersion, PasswordGeneratorParam } from "../../native"

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
    type: "get-secret"
    storeName: string
    secretId: string
  }
  | {
    type: "get-secret-version"
    storeName: string
    blockId: string
  }
  | {
    type: "add-secret-version"
    storeName: string
    secretVersion: SecretVersion
  }
  | {
    type: "text-to-clipboard"
    content: string
  }
  | {
    type: "clear-clipboard"
  }
  | {
    type: "generate-id"
  }
  | {
    type: "generate-password"
    param: PasswordGeneratorParam
  }
  | {
    type: "calculate-otp-token"
    otpUrl: string
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
