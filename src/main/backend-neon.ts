import { ipcMain, IpcMainEvent, clipboard, BrowserWindow, dialog } from "electron";
import { NeonCommand } from "../common/neon-command";
import native from "../../native";
import * as url from "url";

export class ClipboardControl {
  private clipboardHandle: native.ClipboardHandle;

  constructor(clipboardHandle: native.ClipboardHandle) {
    this.clipboardHandle = clipboardHandle;
  }

  isDone(): boolean {
    return native.clipboard_is_done(this.clipboardHandle);
  }

  currentlyProviding(): string | undefined {
    return native.clipboard_currently_providing(this.clipboardHandle);
  }

  destroy(): void {
    native.clipboard_destroy(this.clipboardHandle);
  }
}


export class Store {
  private storeHandle: native.StoreHandle;

  constructor(storeHandle: native.StoreHandle) {
    this.storeHandle = storeHandle;
  }

  status(): native.Status {
    return native.store_status(this.storeHandle);
  }

  lock(): void {
    native.store_lock(this.storeHandle);
  }

  unlock(identityId: string, passphrase: string): void {
    native.store_unlock(this.storeHandle, identityId, passphrase);
  }

  identities(): native.Identity[] {
    return native.store_identities(this.storeHandle);
  }

  addIdentity(identity: native.Identity, passphrase: string): void {
    native.store_add_identity(this.storeHandle, identity, passphrase);
  }

  changePassphrase(passphrase: string): void {
    native.store_change_passphrase(this.storeHandle, passphrase);
  }

  list(filter: native.SecretListFilter): native.SecretList {
    return native.store_list(this.storeHandle, filter);
  }

  updateIndex(): void {
    native.store_update_index(this.storeHandle);
  }

  add(secretVersion: native.SecretVersion): string {
    return native.store_add(this.storeHandle, secretVersion);
  }

  get(secretId: string): native.Secret {
    return native.store_get(this.storeHandle, secretId);
  }

  getVersion(blockId: string): native.SecretVersion {
    return native.store_get_version(this.storeHandle, blockId);
  }
}

export class Service {
  private serviceHandle: native.ServiceHandle;

  constructor() {
    this.serviceHandle = native.service_create();
  }

  listStores(): native.StoreConfig[] {
    return native.service_list_stores(this.serviceHandle);
  }

  upsertStoreConfig(config: native.StoreConfig): void {
    native.service_upsert_store_config(this.serviceHandle, config);
  }

  deleteStoreConfig(storeName: string): void {
    native.service_delete_store_config(this.serviceHandle, storeName);
  }

  getDefaultStore(): string | null {
    return native.service_get_default_store(this.serviceHandle);
  }

  setDefaultStore(storeName: string): void {
    native.service_set_default_store(this.serviceHandle, storeName);
  }

  openStore(name: string): Store {
    return new Store(native.service_open_store(this.serviceHandle, name));
  }

  secretToClipboard(storeName: string, secretId: string, properties: string[], displayName: string): ClipboardControl {
    return new ClipboardControl(native.service_secret_to_clipboard(this.serviceHandle, storeName, secretId, properties, displayName));
  }

  generateId(): string {
    return native.service_generate_id(this.serviceHandle);
  }

  generatePassword(param: native.PasswordGeneratorParam): string {
    return native.service_generate_password(this.serviceHandle, param);
  }

  checkAutolock(): void {
    native.service_check_autolock(this.serviceHandle);
  }
}



const service = new Service();
const stores = new Map<string, Store>();

function checkAutolockLoop() {
  try {
    service.checkAutolock();
  }
  catch (e) {
    console.log("UNHANDLED ERRROR", e);
  }

  setTimeout(checkAutolockLoop, 500);
}
setTimeout(checkAutolockLoop, 500);

function getStore(name: string): Store {
  let store = stores.get(name);

  if (store) return store;

  store = service.openStore(name);
  stores.set(name, store);

  return store;
}

async function selectStoreLocation(window: BrowserWindow, defaultPath?: string): Promise<string | null> {
  const result = await dialog.showOpenDialog(window, {
    title: "Select store location",
    defaultPath,
    filters: [],
    properties: ["openDirectory", "createDirectory"],
  });

  return (result.canceled || result.filePaths.length === 0) ? null : decodeURI(url.pathToFileURL(result.filePaths[0]).pathname.substring(1));
}

function processCommand(window: BrowserWindow, command: NeonCommand): Promise<any> {
  switch (command.type) {
    case "list-stores": return Promise.resolve(service.listStores());
    case "upsert-store-config": return Promise.resolve(service.upsertStoreConfig(command.storeConfig));
    case "delete-store-config": return Promise.resolve(service.deleteStoreConfig(command.storeName));
    case "get-default-store": return Promise.resolve(service.getDefaultStore());
    case "set-default-store": return Promise.resolve(service.setDefaultStore(command.storeName));
    case "status": return Promise.resolve(getStore(command.storeName).status());
    case "identities": return Promise.resolve(getStore(command.storeName).identities());
    case "add-identity": return Promise.resolve(getStore(command.storeName).addIdentity(command.identity, command.passphrase));
    case "lock": return Promise.resolve(getStore(command.storeName).lock());
    case "unlock": return Promise.resolve(getStore(command.storeName).unlock(command.identityId, command.passphrase));
    case "list-secrets": return Promise.resolve(getStore(command.storeName).list(command.filter));
    case "get-secret": return Promise.resolve(getStore(command.storeName).get(command.secretId));
    case "get-secret-version": return Promise.resolve(getStore(command.storeName).getVersion(command.blockId));
    case "add-secret-version": {
      const store = getStore(command.storeName);
      const blockId = store.add(command.secretVersion);
      store.updateIndex();
      return Promise.resolve(blockId);
    }
    case "text-to-clipboard": {
      clipboard.writeText(command.content);
      return Promise.resolve();
    }
    case "clear-clipboard": {
      clipboard.clear();
      return Promise.resolve();
    }
    case "generate-id": return Promise.resolve(service.generateId());
    case "generate-password": return Promise.resolve(service.generatePassword(command.param));
    case "calculate-otp-token": return Promise.resolve(native.calculateOtpToken(command.otpUrl));
    case "estimate-password": return Promise.resolve(native.estimatePassword(command.password));
    case "select-store-location": return selectStoreLocation(window, command.defaultPath);
  }
}

export function registerBackend(window: BrowserWindow) {
  ipcMain.on("neon-backend", (event: IpcMainEvent, args: { command: NeonCommand, replyChannel: string }) => {
    try {
      processCommand(window, args.command).then(
        value => event.sender.send(args.replyChannel, { result: "ok", value }),
        e => {
          if (e instanceof Error) {
            event.sender.send(args.replyChannel, { result: "error", error: e.message });
          } else {
            console.log("UNHANDLED ERRROR", e);
          }
        }
      )
    } catch (e) {
      if (e instanceof Error) {
        event.sender.send(args.replyChannel, { result: "error", error: e.message });
      } else {
        console.log("UNHANDLED ERRROR", e);
      }
    }
  });
}