import { MainContext, MainEvents } from "./main"
import { MachineConfig, assign } from "xstate"
import { OTPToken, SecretVersion } from "../../../native"
import { calculateOtpToken, clearClipboard, textToClipboard } from "./backend-neon";

const OTP_PROPERTIES = ["totpUrl"];

export interface DisplaySecretContext {
  currentSecretVersion?: SecretVersion
  otpTokens?: { [name: string]: OTPToken }
  clipboardProperty?: string
}

export type DisplaySecretEvent =
  | { type: "COPY_SECRET_PROPERTY", propertyName: string }

async function checkOTPTokens(context: MainContext): Promise<{ [name: string]: OTPToken }> {
  const { currentSecretVersion } = context;

  const result: { [name: string]: OTPToken } = {};

  for (const name of OTP_PROPERTIES) {
    const otpUrl = currentSecretVersion?.properties[name];

    if (typeof otpUrl !== "string") continue;

    const otpToken = await calculateOtpToken(otpUrl);
    result[name] = otpToken;

    if (name === context.clipboardProperty && typeof otpToken === "object") {
      await textToClipboard(otpToken.totp.token);
    }
  }

  return result;
}

function hasTOPT(context: MainContext): boolean {
  const { otpTokens } = context;

  return Object.keys(otpTokens || {}).length > 0
}

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

export const displaySecretState: MachineConfig<MainContext, any, MainEvents> = {
  initial: "check_otps",
  exit: () => clearClipboard(),
  on: {
    COPY_SECRET_PROPERTY: {
      actions: assign(copySecretProperty),
    },
  },
  states: {
    check_otps: {
      invoke: {
        src: checkOTPTokens,
        onDone: {
          target: "display",
          actions: assign({ otpTokens: (_, event) => event.data }),
        },
      },
    },
    display: {
      after: [{
        delay: 1000,
        cond: hasTOPT,
        target: "check_otps",
      }],
    },
  },
}