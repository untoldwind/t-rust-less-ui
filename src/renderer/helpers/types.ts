import { SecretType, SecretVersion } from "../../../native";

export const SECRET_TYPES: SecretType[] = ["login", "note", "licence", "wlan", "password", "other"];

export const BASE_PROPERTIES: { [name in SecretType]: string[] } = {
  login: ["username", "password", "totpUrl", "notes"],
  note: ["notes"],
  licence: ["notes"],
  wlan: [],
  password: ["password"],
  other: [],
}

export function orderProperties(secretVersion: SecretVersion): { name: string, value: string }[] {
  const result: { name: string, value: string }[] = [];
  const baseProperties = BASE_PROPERTIES[secretVersion.type];

  for (const name of baseProperties) {
    if (name in secretVersion.properties)
      result.push({
        name,
        value: secretVersion.properties[name],
      });
  }
  for (const name in secretVersion.properties) {
    if (!baseProperties.includes(name))
      result.push({
        name,
        value: secretVersion.properties[name],
      });
  }

  return result;
}