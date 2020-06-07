import { Sender } from "xstate";
import { MainEvents } from "./main";
import { status } from "./backend-neon";
import { bind } from "decko";
import { Status } from "../../../native";
import moment from "moment";

export function calculateAutolockIn(status: Status): number {
  if (status.locked) return 0;

  const autoLockIn = moment(status.autolock_at).diff(moment()) / 1000.0;

  return autoLockIn < 0 ? 0 : autoLockIn;
}

export type LockState = "LOCKED" | "UNLOCKED";

export class StatusMonitor {
  private sender: Sender<MainEvents>;
  private storeName: string
  private state: LockState;
  private canceled: boolean;
  private timeoutHandle: number | undefined = undefined;

  constructor(sender: Sender<MainEvents>, storeName: string, state: LockState) {
    this.sender = sender;
    this.storeName = storeName;
    this.state = state;
    this.canceled = false;

    this.loop();
  }

  @bind
  loop() {
    if (this.canceled) return;

    status(this.storeName).then(
      status => {
        if (status.locked && this.state === "UNLOCKED") {
          this.sender({ type: "STORE_LOCKED", storeName: this.storeName });
          this.state = "LOCKED";
        } else if (!status.locked && this.state === "LOCKED") {
          this.sender({ type: "STORE_UNLOCKED", storeName: this.storeName, identity: status.unlocked_by });
          this.state = "UNLOCKED";
        }
        if (!status.locked && this.state === "UNLOCKED") {
          this.sender({ type: "UPDATE_AUTOLOCK_IN", autoLockIn: calculateAutolockIn(status), autoLockTimeout: status.autolock_timeout });
        }
        this.timeoutHandle = window.setTimeout(this.loop, 500);
      },
      error => {
        console.log("Error: ", error);
        this.timeoutHandle = window.setTimeout(this.loop, 500);
      }
    );
  }

  @bind
  shutdown() {
    console.log("Shutdown " + this);
    this.canceled = true;
    typeof this.timeoutHandle === "number" && window.clearTimeout(this.timeoutHandle);
  }
}