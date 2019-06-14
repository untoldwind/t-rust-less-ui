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
}

export interface Translations {
  action: ActionTranslations
  secret: SecretTranslations
}