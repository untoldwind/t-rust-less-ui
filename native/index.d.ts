export interface Identity {
  id: string
  name: string
  email: string
  hidden: boolean
}

export type Status =
  | {
    locked: true
    autolock_timeout: number
    version: string
  }
  | {
    locked: false
    unlocked_by: Identity
    autolock_at: string
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

export interface PasswordGeneratorCharsParam {
  num_chars: number,
  include_uppers: boolean
  include_numbers: boolean
  include_symbols: boolean
  require_upper: boolean
  require_number: boolean
  require_symbol: boolean
  exlcude_similar: boolean
  exclude_ambiguous: boolean
}

export interface PasswordGeneratorWordsParam {
  num_words: number
  delim: string
}

export type PasswordGeneratorParam =
  | {
    chars: PasswordGeneratorCharsParam
  }
  | {
    words: PasswordGeneratorWordsParam
  }
  export interface StoreConfig {
    name: string
    store_url: string
    client_id: string
    autolock_timeout_secs: number
    default_identity_id?: string
  }
  
  export type OTPToken = 
    | "Invalid"
    | {
      "totp": {
        token: string
        period: number
        valid_until: string
        valid_for: number
      }
    }
  
type StoreHandle = "store-handle-placeholder";

declare function store_status(handle: StoreHandle): Status;
declare function store_lock(handle: StoreHandle): void;
declare function store_unlock(handle: StoreHandle, identityId: string, passphrase: string): void;
declare function store_identities(handle: StoreHandle): Identity[]
declare function store_add_identity(handle: StoreHandle, identity: Identity, passphrase: string): void
declare function store_change_passphrase(handle: StoreHandle, passphrase: string): void
declare function store_list(handle: StoreHandle, filter: SecretListFilter): SecretList
declare function store_update_index(handle: StoreHandle): void;
declare function store_add(handle: StoreHandle, secretVersion: SecretVersion): string;
declare function store_get(handle: StoreHandle, secretId: string): Secret;
declare function store_get_version(handle: StoreHandle, blockId: string): SecretVersion;



type ClipboardHandle = "clipboard-handle-placeholder";

declare function clipboard_is_done(handle: ClipboardHandle): boolean;
declare function clipboard_currently_providing(handle: ClipboardHandle): string | undefined;
declare function clipboard_destroy(handle: ClipboardHandle): void;

type ServiceHandle = "service-handle-placeholder";

declare function service_create() : ServiceHandle;
declare function service_list_stores(handle: ServiceHandle) : StoreConfig[];
declare function service_upsert_store_config(handle: ServiceHandle, config: StoreConfig) : void;
declare function service_delete_store_config(handle: ServiceHandle, storeName: string) : void;
declare function service_get_default_store(handle: ServiceHandle) : string | null;
declare function service_set_default_store(handle: ServiceHandle, storeName: string) : StoreHandle;
declare function service_open_store(handle: ServiceHandle, name: String) : StoreHandle;
declare function service_secret_to_clipboard(handle: ServiceHandle, storeName: string, secretId: string, properties: string[], displayName: string) : ClipboardHandle;
declare function service_generate_id(handle: ServiceHandle) : string;
declare function service_generate_password(handle: ServiceHandle, param: PasswordGeneratorParam) : string;
declare function service_check_autolock(handle: ServiceHandle) : void;


export declare function calculateOtpToken(otpUrl: string) : OTPToken;

export declare function estimatePassword(password: string): PasswordStrength;
