export interface StoreConfig {
  name: string
  store_url: string
  client_id: string
  autolock_timeout_secs: number
}

export interface Identity {
  id: string
  name: string
  email: string
}

export interface Status {
  locked: boolean
  unlocked_by?: Identity
  autolock_at?: string
  version: string
}

export type SecretType = "login" | "note" | "licence" | "wlan" | "password" | "other";

export interface SecretListFilter {
  url?: string
  tag?: string
  secret_type?: SecretType
  name?: string
  deleted?: boolean
}

export interface SecretEntry {
  id: string
  name: string
  secret_type: SecretType
  tags: string[]
  urls: string[]
  timestamp: string
  deleted: boolean
}

export interface SecretEntryMatch {
  entry: SecretEntry
  name_score: number
  name_highlights: number[]
  url_highlights: number[]
  tags_highlights: number[]
}

export interface SecretList {
  all_Tags: string[]
  entries: SecretEntryMatch[]
}

export interface SecretAttachment {
  name: string
  mime_type: string
  content: string
}

export interface SecretVersion {
  secret_id: string
  secret_type: SecretType
  timestamp: string
  name: string
  tags: string[]
  urls: string[]
  properties: { [name: string]: string }
  attachments: SecretAttachment[]
  deleted: boolean
  recipients: string[]
}

export interface PasswordEstimate {
  password: string
  inputs: string[]
}

export interface PasswordStrength {
  entropy: number
  crack_time: string
  crack_time_display: string
  score: number
}

export interface Secret {
  id: string
  secret_type: SecretType
  current: SecretVersion
  versions: string[]
  password_strengths: { [name: string]: PasswordStrength }
}

export interface ServiceError {
  error: any
  display: string
}