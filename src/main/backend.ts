import * as childProcess from "child_process";
import * as os from "os";
import { Command } from "../common/commands";
import { CommandResult } from "../common/command_results";
import { ipcMain, Event } from "electron";

const native = childProcess.spawn(process.env["HOME"] + "/.cargo/bin/t-rust-less-native", [], { stdio: ['pipe', 'pipe', process.stderr] });

native.stdout.on("data", processResponse);

let idCounter = 0;
let chunks: Buffer[] = [];
const resultReceivers: Map<number, (result: CommandResult) => void> = new Map();

function processResponse(chunk: Buffer) {
  chunks.push(chunk);

  if (chunks.map(chunk => chunk.length).reduce((a, b) => a + b) < 4) return;

  const data = Buffer.concat(chunks);
  chunks = [];

  let len;
  if (os.endianness() === "LE") {
    len = data.readUInt32LE(0);
  } else {
    len = data.readUInt32BE(0);
  }
  if (data.length < 4 + len) {
    chunks.push(data);
    return;
  }
  const message = JSON.parse(data.toString("utf8", 4));

  if (typeof message !== "object" || typeof message.id !== "number" || typeof message.result === "undefined") {
    console.log("Droping invalid response: ", message);
    return;
  }
  const resultReceiver = resultReceivers.get(message.id);
  if (!resultReceiver) {
    console.log("No receiver for: ", message);
    return;
  }
  resultReceiver(message.result);
  resultReceivers.delete(message.id);
}

function sendRequest(request: any) {
  const json = JSON.stringify(request);
  const len = Buffer.byteLength(json, "utf8");
  const buffer = Buffer.allocUnsafe(4 + len);

  if (os.endianness() === "LE") {
    buffer.writeUInt32LE(len, 0);
  } else {
    buffer.writeUInt32BE(len, 0);
  }
  buffer.write(json, 4, len, "utf8");

  native.stdin.write(buffer);
}

export function sendCommand(command: Command, resultReceiver: (result: CommandResult) => void) {
  const id = idCounter++;

  resultReceivers.set(id, resultReceiver);
  sendRequest({ id, command });
}

ipcMain.on("backend", (event: Event, args: { command: Command, replyChannel: string }) => {
  sendCommand(args.command, result => {
    event.sender.send(args.replyChannel, result);
  })
})