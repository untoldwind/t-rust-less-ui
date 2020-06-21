import { MainContext, MainEvents } from "./main"
import { MachineConfig, assign } from "xstate"
import { OTPToken, SecretVersion } from "../../../native"
import { calculateOtpToken } from "./backend-neon";

const OTP_PROPERTIES = ["totpUrl"];

export interface DisplaySecretContext {
  currentSecretVersion?: SecretVersion
  otpTokens?: { [name: string]: OTPToken }
}

async function checkOTPTokens(context: MainContext): Promise<{ [name: string]: OTPToken }> {
  const { currentSecretVersion } = context;

  const result: { [name: string]: OTPToken } = {};

  for (const name of OTP_PROPERTIES) {
    const otpUrl = currentSecretVersion?.properties[name];

    if (typeof otpUrl !== "string") continue;

    result[name] = await calculateOtpToken(otpUrl);
  }

  return result;
}

function hasTOPT(context: MainContext): boolean {
  const { otpTokens } = context;

  return Object.keys(otpTokens || {}).length > 0
}

export const displaySecretState: MachineConfig<MainContext, any, MainEvents> = {
  initial: "check_otps",
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