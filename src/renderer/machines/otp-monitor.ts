import { Sender } from "xstate";
import { MainEvents } from "./main";
import { SecretVersion } from "../../../native";
import { bind } from "decko";
import { calculateOtpToken } from "./backend-neon";
import { OTPTokens } from "./display-secret";

export const OTP_PROPERTIES = ["totpUrl"];

export class OTPMonitor {
  private sender: Sender<MainEvents>;
  private secretVersion: SecretVersion
  private canceled: boolean;
  private timeoutHandle: number | undefined = undefined;

  constructor(sender: Sender<MainEvents>, secretVersion: SecretVersion) {
    this.sender = sender;
    this.secretVersion = secretVersion;
    this.canceled = false;

    this.loop();
  }

  @bind
  async loop() {
    if (this.canceled) return;

    try {
      const otpTokens: OTPTokens = {};

      for (const name of OTP_PROPERTIES) {
        const otpUrl = this.secretVersion.properties[name];

        if (typeof otpUrl !== "string") continue;

        const otpToken = await calculateOtpToken(otpUrl);
        otpTokens[name] = otpToken;
      }

      if (Object.keys(otpTokens).length === 0) return;

      this.sender({ type: "UPDATE_OTP_TOKENS", otpTokens })

      this.timeoutHandle = window.setTimeout(this.loop, 1000);
    } catch (error) {
      console.log("Error: ", error);
      this.timeoutHandle = window.setTimeout(this.loop, 1000);
    }
  }

  @bind
  shutdown() {
    this.canceled = true;
    typeof this.timeoutHandle === "number" && window.clearTimeout(this.timeoutHandle);
  }
}