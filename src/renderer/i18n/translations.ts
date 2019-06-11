
export interface ActionTranslations {
  lock: string
  unlock: string
}

export interface SecretTranslations {
  name: string
  type: string
  property: (name: string) => string
}

export interface Translations {
  action: ActionTranslations
  secret: SecretTranslations
}