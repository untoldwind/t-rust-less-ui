import { ipcMain, IpcMainEvent, clipboard } from "electron";
import { NeonCommand } from "../common/neon-command";
import { Service, Store, calculateOtpToken } from "../../native";

const service = new Service();
const stores = new Map<string, Store>();

function getStore(name: string): Store {
  let store = stores.get(name);

  if (store) return store;

  store = service.openStore(name);
  stores.set(name, store);

  return store;
}

function processCommand(command: NeonCommand): any {
  switch (command.type) {
    case "list-stores": return service.listStores();
    case "get-default-store": return service.getDefaultStore();
    case "status": return getStore(command.storeName).status();
    case "identities": return getStore(command.storeName).identities();
    case "lock": return getStore(command.storeName).lock();
    case "unlock": return getStore(command.storeName).unlock(command.identityId, command.passphrase);
    case "list-secrets": return getStore(command.storeName).list(command.filter);
    case "get-secret": return getStore(command.storeName).get(command.secretId);
    case "get-secret-version": return getStore(command.storeName).getVersion(command.blockId);
    case "add-secret-version": return getStore(command.storeName).add(command.secretVersion);
    case "text-to-clipboard": {
      clipboard.writeText(command.content);
      return;
    }
    case "clear-clipboard": {
      clipboard.clear();
      return;
    }
    case "generate-id": return service.generateId();
    case "generate-password": return service.generatePassword(command.param);
    case "calculate-otp-token": return calculateOtpToken(command.otpUrl);
  }
}

export function registerBackend() {
  ipcMain.on("neon-backend", (event: IpcMainEvent, args: { command: NeonCommand, replyChannel: string }) => {
    try {
      const value = processCommand(args.command);
      event.sender.send(args.replyChannel, { result: "ok", value });
    } catch (e) {
      if (e instanceof Error) {
        event.sender.send(args.replyChannel, { result: "error", error: e.message });
      } else {
        console.log("UNHANDLED ERRROR", e);
      }
    }
  });
}