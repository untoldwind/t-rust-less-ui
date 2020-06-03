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

export interface Translations {
  action: ActionTranslations
  secret: SecretTranslations
  formatTimestamp: (timestamp: string) => string,
}