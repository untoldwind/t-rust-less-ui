import { Translations } from "./translations";

export const EN: Translations = {
  action: {
    lock: "Lock",
    unlock: "Unlock",
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
  },
}