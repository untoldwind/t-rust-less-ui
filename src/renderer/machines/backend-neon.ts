import { NeonCommand, NeonResult } from "../../common/neon-command";
import { Status, Identity, SecretListFilter, SecretList, Secret } from "../../../native";
import { IpcRenderer } from "electron";

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
}

let neonIdCounter = 0;

function sendNeonCommand<T>(command: NeonCommand): Promise<T> {
  const replyChannel = `neon-backend-${neonIdCounter++}`;

  return new Promise((resolve, reject) => {
    window.ipcRenderer.once(replyChannel, (_: Event, args: NeonResult<T>) => {
      switch (args.result) {
        case "ok":
          resolve(args.value);
          return;
        case "error":
          reject(args.error);
      }
    });
    window.ipcRenderer.send("neon-backend", { command, replyChannel });
  });
}

export function getDefaultStore(): Promise<string | null> {
  return sendNeonCommand({ type: "get-default-store" });
}

export function listStores(): Promise<string[]> {
  return sendNeonCommand({ type: "list-stores" });
}

export function status(storeName: string): Promise<Status> {
  return sendNeonCommand({ type: "status", storeName });
}

export function identities(storeName: string): Promise<Identity[]> {
  return sendNeonCommand({ type: "identities", storeName });
}

export function lock(storeName: string): Promise<void> {
  return sendNeonCommand({ type: "lock", storeName });
}

export function unlock(storeName: string, identityId: string, passphrase: string): Promise<void> {
  return sendNeonCommand({ type: "unlock", storeName, identityId, passphrase });
}

export function listSecrets(storeName: string, filter: SecretListFilter): Promise<SecretList> {
  return sendNeonCommand({ type: "list-secrets", storeName, filter });
}

export function getSecret(storeName: string, secretId: string): Promise<Secret> {
  return sendNeonCommand({ type: "get-secret", storeName, secretId });
}