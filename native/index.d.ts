export interface Identity {
  id: string
  name: string
  email: string
}

export interface Status {
  locked: boolean
  unlocked_by: Identity | null
  autolock_at: string | null
  autolock_timeout: number
  version: string
}

export type SecretType =
  | "login"
  | "note"
  | "licence"
  | "wlan"
  | "password"
  | "other";

export interface SecretEntry {
  id: string
  name: string
  type: SecretType
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
  all_tags: string[]
  entries: SecretEntryMatch[]
}

export interface SecretListFilter {
  url?: string
  tag?: string
  type?: SecretType
  name?: string
  deleted?: boolean
}

export interface SecretAttachment {
  name: string
  mime_type: string
  content: string
}

export interface SecretVersion {
  secret_id: string
  name: string
  type: SecretType
  tags: string[]
  urls: string[]
  timestamp: string
  deleted: boolean
  properties: { [key: string]: string }
  attachments: SecretAttachment[]
  recipients: string[]
}

export interface PasswordStrength {
  entropy: number
  crack_time: number
  crack_time_display: string
  score: number
}

export interface SecretVersionRef {
  block_id: string
  timestamp: string
}

export interface Secret {
  id: string
  type: SecretType
  current: SecretVersion
  current_block_id: string
  versions: SecretVersionRef[]
  password_strengths: { [key: string]: PasswordStrength }
}

export declare class Store {
  status(): Status
  lock(): void
  unlock(identityId: string, passphrase: string): void
  identities(): Identity[]
  addIdentity(identity: Identity, passphrase: string): void
  changePassphrase(passphrase: string): void
  list(filter: SecretListFilter): SecretList
  updateIndex(): void
  add(secretVersion: SecretVersion): string
  get(secretId: string): Secret
  getVersion(blockId: string): SecretVersion
}

export declare class ClipboardControl {
  isDone(): boolean
  currentlyProviding(): string | undefined
  destroy(): void
}

export declare class Service {
  listStores(): string[]
  getDefaultStore(): string | null
  openStore(name: string): Store
  secretToClipboard(storeName: string, secretId: string, properties: string[], displayName: string): ClipboardControl
}
