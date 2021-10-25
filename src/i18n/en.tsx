import { Translations } from "./translations";
import moment from "moment";

function pad(num: number): string {
  return ("0" + num).slice(-2);
}

export const EN: Translations = {
  action: {
    lock: "Lock",
    unlock: "Unlock",
    config: "Configure stores",
    autolockIn: (seconds: number) => `Autolock in ${Math.floor(seconds / 60)}:${pad(Math.floor(seconds) % 60)}`,
    cancel: "Cancel",
    create: "Create",
    ok: "Ok",
    editSecret: "Edit Secret",
    archiveSecret: "Archive Secret",
    unarchiveSecret: "Unarchive Secret",
    confirm: "Confirm",
  },
  secret: {
    name: "Name",
    type: "Type",
    property: (name: string) => {
      switch (name) {
        case "username": return "Username";
        case "password": return "Password";
        case "notes": return "Notes";
        case "totpUrl": return "TOTP";
        default: return name;
      }
    },
    typeName: {
      "login": "Login",
      "licence": "Licence",
      "wlan": "WLAN",
      "password": "Password",
      "other": "Other",
      "note": "Note",
    },
    strength: {
      entropy: "Entropy",
      cracktime: "Cracktime",
      score: "Score",
    },
    archived: "Archived",
    noSecretTitle: "No secret",
    noSecretDescription: "Select an existing secret of create a new",
    tags: "Tags",
    urls: "URLs",
    recipients: "Recipients",
  },
  storeConfig: {
    stores: "Stores",
    addStore: "Add store",
    clientId: "Client Id",
    storeName: "Name",
    type: "Type",
    directory: "Directory",
    identities: "Identities",
    autolockTimeout: "Autolock in",
    autolockTimeoutUnit: "sec",
    noIdentities: "Store does not have any identities yet. Please add one.",
    addIdentity: "Add Identity",
    identityName: "Name",
    identityEmail: "Email",
    identityPassphrase: "Passphrase",
  },
  passwordGenerator: {
    chars: "Chars",
    numChars: "Chars",
    includeUppers: "Include uppers",
    includeNumbers: "Include numbers",
    includeSymbols: "Include symbols",
    requireUpper: "Require upper",
    requireNumber: "Require number",
    requireSymbol: "Require symbol",
    excludeSimilar: "Exclude similar",
    excludeAmbigous: "Exclude ambigous",
    words: "Words",
    numWords: "Words",
    delim: "Delim",
  },
  unlock: {
    noStoresTitle: "No configured stores",
    noStoresDescription: "Add existing stores or create a new one.",
  },
  clipboard: {
    controlTitle: "Clipboard providing",
    secretName: "Secret",
    property: "Property",
    nextButton: "Next",
    cancelButton: "Cancel",
  },
  formatTimestamp: (timestamp: string) => moment(timestamp).format("YYYY-MM-DD HH:mm:ss Z"),
}