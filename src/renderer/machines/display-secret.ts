import { MainContext, MainEvents } from "./main"
import { MachineConfig, assign } from "xstate"
import { OTPToken, SecretVersion } from "../../../native"
import { clearClipboard, textToClipboard } from "./backend-neon";
import { OTPMonitor } from "./otp-monitor";

export type OTPTokens = { [name: string]: OTPToken };

export interface DisplaySecretContext {
  currentSecretVersion?: SecretVersion
  otpTokens?: OTPTokens
  clipboardProperty?: string
}

export type DisplaySecretEvent =
  | { type: "COPY_SECRET_PROPERTY", propertyName: string }
  | { type: "UPDATE_OTP_TOKENS", otpTokens: OTPTokens }

function copySecretProperty(context: MainContext, event: { type: "COPY_SECRET_PROPERTY", propertyName: string }): Partial<MainContext> {
  if (!context.currentSecretVersion || !(event.propertyName in context.currentSecretVersion.properties)) return {};

  if (typeof context.otpTokens === "object" && (event.propertyName in context.otpTokens)) {
    const otpToken = context.otpTokens[event.propertyName];

    textToClipboard(typeof otpToken === "object" ? otpToken.totp.token : context.currentSecretVersion.properties[event.propertyName]);
  } else {
    textToClipboard(context.currentSecretVersion.properties[event.propertyName]);
  }
  return {
    clipboardProperty: event.propertyName,
  }
}

function updateOTPClipboard(context: MainContext, event: { type: "UPDATE_OTP_TOKENS", otpTokens: OTPTokens }) {
  if (typeof context.clipboardProperty !== "string" || !(context.clipboardProperty in event.otpTokens)) return;

  const otpToken = event.otpTokens[context.clipboardProperty];

  if (typeof otpToken !== "object") return;

  textToClipboard(otpToken.totp.token);
}

export const displaySecretState: MachineConfig<MainContext, any, MainEvents> = {
  initial: "display",
  exit: () => clearClipboard(),
  states: {
    display: {
      invoke: {
        src: context => callback => {
          const { currentSecretVersion } = context;
          if (!currentSecretVersion) return () => { };
          return new OTPMonitor(callback, currentSecretVersion).shutdown;
        },
      },
      on: {
        COPY_SECRET_PROPERTY: {
          actions: assign(copySecretProperty),
        },
        UPDATE_OTP_TOKENS: {
          actions: [
            assign({ otpTokens: (_, event) => event.otpTokens }),
            updateOTPClipboard,
          ],
        },
      },
    },
  },
}