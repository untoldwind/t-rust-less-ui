import { app, shell, dialog, invoke } from "@tauri-apps/api";
import { writeText } from "@tauri-apps/api/clipboard";

export interface AppVersion {
  version: string
  tauriVersion: string
}

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

export async function getAppVersion(): Promise<AppVersion> {
  const version = await app.getVersion();
  const tauriVersion = await app.getTauriVersion();

  return {
    version,
    tauriVersion,
  }
}

export function openExternal(url: string) {
  shell.open(url).then(() => { }, () => { });
}

export function getDefaultStore(): Promise<string | null> {
  return invoke("service_get_default_store");
}

export function setDefaultStore(storeName: string): Promise<void> {
  return invoke("service_set_default_store", {
    storeName,
  });
}

export function listStores(): Promise<StoreConfig[]> {
  return invoke("service_list_stores");
}

export function upsertStoreConfig(storeConfig: StoreConfig): Promise<StoreConfig> {
  return invoke("service_upsert_store_config", {
    storeConfig,
  });
}

export function deleteStoreConfig(storeName: string): Promise<void> {
  return invoke("service_delete_store_config", {
    storeName,
  });
}

export function status(storeName: string): Promise<Status> {
  return invoke("store_status", {
    storeName,
  });
}

export function identities(storeName: string): Promise<Identity[]> {
  return invoke("store_identities", {
    storeName,
  });
}

export function lock(storeName: string): Promise<void> {
  return invoke("store_lock", {
    storeName,
  });
}

export function unlock(storeName: string, identityId: string, passphrase: string): Promise<void> {
  return invoke("store_unlock", {
    storeName,
    identityId,
    passphrase,
  });
}

export function listSecrets(storeName: string, filter: SecretListFilter): Promise<SecretList> {
  return invoke("store_list", {
    storeName,
    filter,
  });
}

export function getSecret(storeName: string, secretId: string): Promise<Secret> {
  return invoke("store_get", {
    storeName,
    secretId,
  });
}

export function getSecretVersion(storeName: string, blockId: string): Promise<SecretVersion> {
  return invoke("store_get_version", {
    storeName,
    blockId,
  });
}

export function addSecretVersion(storeName: string, secretVersion: SecretVersion): Promise<string> {
  return invoke("store_add", {
    storeName,
    secretVersion,
  });
}

export function textToClipboard(content: string): Promise<void> {
  return writeText(content);
}

export function clearClipboard(): Promise<void> {
  return writeText("");
}

export function generateId(): Promise<string> {
  return invoke("service_generate_id");
}

export function generatePassword(param: PasswordGeneratorParam): Promise<string> {
  return invoke("service_generate_password", {
    param,
  });
}

export function calculateOtpToken(otpUrl: string): Promise<OTPToken> {
  return invoke("alculate_otp_token", {
    otpUrl,
  });
}

export function estimatePassword(password: string): Promise<PasswordStrength> {
  return invoke("estimate_password_strength", {
    password,
  });
}

export async function selectStoreLocation(defaultPath?: string): Promise<string | null> {
  console.log(">>> in");
  const result = await dialog.open({
    multiple: false,
    directory: true,
  }) as string | null;

  return result ? decodeURI(`file://${result}`) : null;
}

export function addIdentity(storeName: string, identity: Identity, passphrase: string): Promise<void> {
  return invoke("store_add_identity", {
    storeName,
    identity,
    passphrase,
  });
}
