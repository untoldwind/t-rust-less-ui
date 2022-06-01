import React, { PropsWithChildren } from "react";
import { useHotkeys } from "@blueprintjs/core";
import { ListSecrets } from "./list-secrets";
import { useCopySecretProperties, useSecretNavigate } from "../machines/actions";
import { ClipboardControl } from "./clipboard-control";
import { ZoomDisplay } from "./zoom-display";
import { useRecoilValue } from "recoil";
import { editSecretVersionState } from "../machines/state";

export const ListSecretsHotkeys: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { secretUp, secretDown } = useSecretNavigate();
  const copySecretProperties = useCopySecretProperties();
  const editSecretVersion = useRecoilValue(editSecretVersionState);

  const hotkeys = React.useMemo(() => !editSecretVersion ? [{
    combo: "up",
    global: true,
    allowInInput: true,
    label: "Previous entry",
    onKeyDown: secretUp,
  }, {
    combo: "down",
    global: true,
    allowInInput: true,
    label: "Next entry",
    onKeyDown: secretDown,
  }, {
    combo: "ctrl + a",
    global: true,
    allowInInput: true,
    preventDefault: true,
    label: "Copy username/password/totp",
    onKeyDown: () => copySecretProperties(["username", "password", "totpUrl"]),
  }, {
    combo: "ctrl + u",
    global: true,
    allowInInput: true,
    label: "Copy username",
    onKeyDown: () => copySecretProperties(["username"]),
  }, {
    combo: "ctrl + p",
    global: true,
    allowInInput: true,
    label: "Copy username",
    onKeyDown: () => copySecretProperties(["password"]),
  }, {
    combo: "ctrl + o",
    global: true,
    allowInInput: true,
    label: "Copy totp",
    onKeyDown: () => copySecretProperties(["totpUrl"]),
  }] : [], [secretUp, secretDown, copySecretProperties, editSecretVersion]);
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

  return (
    <>
      <ListSecrets onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
      <ClipboardControl />
      <ZoomDisplay />
    </>
  )
};
