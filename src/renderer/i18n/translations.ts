import { SecretType } from "../../../native";

export interface ActionTranslations {
  lock: string
  unlock: string
  config: string
  autolockIn: (seconds: number) => string
  cancel: string
  create: string
  ok: string
  editSecret: string
  archiveSecret: string
  unarchiveSecret: string
  confirm: string
}

export interface SecretTranslations {
  name: string
  type: string
  property: (name: string) => string
  typeName: { [type in SecretType]: string }
  strength: {
    entropy: string
    cracktime: string
    score: string
  }
  archived: string
  noSecretTitle: string
  noSecretDescription: string
  tags: string
  urls: string
}

export interface PasswordGeneratorTranslations {
  chars: string
  numChars: string
  includeUppers: string
  includeNumbers: string
  includeSymbols: string
  requireUpper: string
  requireNumber: string
  requireSymbol: string
  excludeSimilar: string
  excludeAmbigous: string
  words: string
  numWords: string
  delim: string
}

export interface StoreConfigTranslations {
  stores: string
  addStore: string
  clientId: string
  storeName: string
  type: string
  directory: string
  identities: string
  autolockTimeout: string
  autolockTimeoutUnit: string
  noIdentities: string
  addIdentity: string
  identityName: string
  identityEmail: string
  identityPassphrase: string
}

export interface Translations {
  action: ActionTranslations
  secret: SecretTranslations
  storeConfig: StoreConfigTranslations
  passwordGenerator: PasswordGeneratorTranslations
  formatTimestamp: (timestamp: string) => string,
}