import { IpcRenderer } from "electron";
import { CommandResult } from "../common/command_results";
import { Command } from "../common/commands";

declare global {
    interface Window {
        ipcRenderer: IpcRenderer
    }
}

let idCounter = 0;

export function sendCommand(command: Command, resultReceiver: (result: CommandResult) => void) {
    const replyChannel = `backend-${idCounter++}`;

    window.ipcRenderer.once(replyChannel, (_ : Event, args: CommandResult) => {
        resultReceiver(args);
    });
    window.ipcRenderer.send("backend", {command, replyChannel});
}