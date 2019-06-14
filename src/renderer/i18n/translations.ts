import { SecretType } from "../../common/model";

export interface ActionTranslations {
  lock: string
  unlock: string
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
}

export interface Translations {
  action: ActionTranslations
  secret: SecretTranslations
}