import { Translations } from "./translations";
import moment from "moment";

function pad(num: number): string {
  return ("0" + num).slice(-2);
}

export const EN: Translations = {
  action: {
    lock: "Lock",
    unlock: "Unlock",
    autolockIn: (seconds: number) => `Autolock in ${Math.floor(seconds / 60)}:${pad(Math.floor(seconds) % 60)}`,
  },
  secret: {
    name: "Name",
    type: "Type",
    property: (name: string) => {
      switch (name) {
        case "username": return "Username";
        case "password": return "Password";
        default: return name;
      }
    },
    typeName: {
      "login": "Login",
      "licence": "Licence",
      "wlan": "WLAN",
      "password": "Password",
      "other": "Other",
      "note": "Note",
    },
    strength: {
      entropy: "Entropy",
      cracktime: "Cracktime",
      score: "Score",
    },
    deleted: "Deleted",
    noSecretTitle: "No secret",
    noSecretDescription: "Select an existing secret of create a new",
  },
  formatTimestamp: (timestamp: string) => moment(timestamp).format("YYYY-MM-DD HH:mm:ss Z"),
}