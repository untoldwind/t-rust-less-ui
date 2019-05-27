import { IpcRenderer } from "electron";
import { CommandResult, isStringList, isError, isIdentities, isStatus } from "../../common/command_results";
import { Command } from "../../common/commands";
import { ServiceError, Identity, Status } from "../../common/model";

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

export function expectStringList(success: (result: string[]) => void, failure: (error: ServiceError) => void) : (commandResult: CommandResult) => void {
    return (commandResult: CommandResult) => {
        if(isStringList(commandResult))
            success(commandResult.string_list);
        else if(isError(commandResult))
            failure(commandResult.error);
        else
            failure({ error: commandResult, display: "Expected string list"})
    }
}

export function expectStatus(success: (result: Status) => void, failure: (error: ServiceError) => void): (commandResult: CommandResult) => void {
    return (commandResult: CommandResult) => {
        if(isStatus(commandResult))
            success(commandResult.status);
        else if(isError(commandResult))
            failure(commandResult.error);
        else
            failure({ error: commandResult, display: "Expected string list"})
    }
}

export function expectIdentities(success: (result: Identity[]) => void, failure: (error: ServiceError) => void): (commandResult: CommandResult) => void {
    return (commandResult: CommandResult) => {
        if(isIdentities(commandResult))
            success(commandResult.identities);
        else if(isError(commandResult))
            failure(commandResult.error);
        else
            failure({ error: commandResult, display: "Expected string list"})
    }
}