import { ipcMain, IpcMainEvent, clipboard, BrowserWindow, dialog } from "electron";
import { NeonCommand } from "../common/neon-command";
import { Service, Store, calculateOtpToken, estimatePassword } from "../../native";

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

  return (result.canceled || result.filePaths.length === 0) ? null : result.filePaths[0];
}

function processCommand(window: BrowserWindow, command: NeonCommand): Promise<any> {
  switch (command.type) {
    case "list-stores": return Promise.resolve(service.listStores());
    case "upsert-store-config": return Promise.resolve(service.upsertStoreConfig(command.storeConfig));
    case "delete-store-config": return Promise.resolve(service.deleteStoreConfig(command.storeName));
    case "get-default-store": return Promise.resolve(service.getDefaultStore());
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
    case "calculate-otp-token": return Promise.resolve(calculateOtpToken(command.otpUrl));
    case "estimate-password": return Promise.resolve(estimatePassword(command.password));
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