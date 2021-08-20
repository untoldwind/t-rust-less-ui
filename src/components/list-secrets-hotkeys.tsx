import React from "react";
import { useHotkeys } from "@blueprintjs/core";
import { ListSecrets } from "./list-secrets";
import { useCopySecretProperties, useSecretNavigate } from "../machines/actions";
import { ClipboardControl } from "./clipboard-control";

export const ListSecretsHotkeys: React.FC = ({ children }) => {
  const { secretUp, secretDown } = useSecretNavigate();
  const copySecretProperties = useCopySecretProperties();

  const hotkeys = React.useMemo(() => [{
    combo: "up",
    global: true,
    label: "Previous entry",
    onKeyDown: secretUp,
  }, {
    combo: "down",
    global: true,
    label: "Next entry",
    onKeyDown: secretDown,
  }, {
    combo: "ctrl + a",
    global: true,
    label: "Copy username/password/totp",
    onKeyDown: () => copySecretProperties(["username", "password", "totpUrl"]),
  }, {
    combo: "ctrl + u",
    global: true,
    label: "Copy username",
    onKeyDown: () => copySecretProperties(["username"]),
  }, {
    combo: "ctrl + p",
    global: true,
    label: "Copy username",
    onKeyDown: () => copySecretProperties(["password"]),
  }, {
    combo: "ctrl + o",
    global: true,
    label: "Copy totp",
    onKeyDown: () => copySecretProperties(["totpUrl"]),
  }], [secretUp, secretDown, copySecretProperties]);
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

  return (
    <>
      <ListSecrets onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
      <ClipboardControl />
    </>
  )
};
