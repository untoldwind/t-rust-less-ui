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
        case "password": return "password";
        default: return name;
      }
    },
  },
}