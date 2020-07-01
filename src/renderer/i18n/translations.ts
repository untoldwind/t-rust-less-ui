import { SecretType } from "../../../native";

export interface ActionTranslations {
  lock: string
  unlock: string
  autolockIn: (seconds: number) => string
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
  deleted: string
  noSecretTitle: string
  noSecretDescription: string
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

export interface Translations {
  action: ActionTranslations
  secret: SecretTranslations
  passwordGenerator: PasswordGeneratorTranslations
  formatTimestamp: (timestamp: string) => string,
}