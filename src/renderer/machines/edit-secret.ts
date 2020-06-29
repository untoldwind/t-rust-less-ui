import { MachineConfig, assign } from "xstate";
import { MainContext, MainEvents } from "./main";
import { SecretVersion } from "../../../native";
import { generateId } from "./backend-neon";
import moment from "moment";

export interface EditSecretContext {
  editSecretVersion?: SecretVersion
}

export type EditSecretState =
  | {
    value: "unlocked.edit_secret_version.editable",
    context: MainContext & {
      editSecretVersion: SecretVersion,
    },
  }

export type EditSecretEvent =
  | {
    type: "CHANGE_EDIT_SECRET_VERSION",
    change: Partial<SecretVersion>,
  }

async function cloneOrCreate(context: MainContext, event: MainEvents): Promise<SecretVersion> {
  const { selectedIdentity, currentSecretVersion } = context;

  if (!selectedIdentity) throw "Invalid state";

  switch (event.type) {
    case "CREATE_SECRET":
      const secret_id = await generateId();
      return {
        secret_id,
        type: event.secretType,
        name: "",
        timestamp: moment().format(),
        tags: [],
        urls: [],
        properties: {},
        deleted: false,
        attachments: [],
        recipients: [selectedIdentity.id],
      }
    case "NEW_SECRET_VERSION":
      if (!currentSecretVersion) throw "Invalid state";
      return {
        ...currentSecretVersion,
        timestamp: moment().format(),
      }
    default:
      throw "Invalid event"
  }
}

function mergeChange(context: MainContext, event: { type: "CHANGE_EDIT_SECRET_VERSION", change: Partial<SecretVersion> }): Partial<MainContext> {
  if (!context.editSecretVersion) return {};

  return {
    editSecretVersion: {
      ...context.editSecretVersion,
      ...event.change,
      properties: {
        ...context.editSecretVersion.properties,
        ...(event.change.properties || {}),
      },
    },
  }
}

export const editSecretState: MachineConfig<MainContext, any, MainEvents> = {
  initial: "cloneOrCreate",
  states: {
    cloneOrCreate: {
      invoke: {
        src: cloneOrCreate,
        onDone: {
          target: "editable",
          actions: assign((_, event) => ({
            editSecretVersion: event.data,
            selectedSecretId: event.data.secret_id,
          })),
        },
      },
    },
    editable: {
      on: {
        CHANGE_EDIT_SECRET_VERSION: {
          actions: assign(mergeChange),
        },
      },
    },
  },
}