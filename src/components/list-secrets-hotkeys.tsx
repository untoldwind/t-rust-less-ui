import React, { PropsWithChildren, useContext } from "react";
import { useHotkeys } from "@blueprintjs/core";
import { ListSecrets } from "./list-secrets";
import { ClipboardControl } from "./clipboard-control";
import { BrowseStateContext } from "../contexts/browse-state";

export const ListSecretsHotkeys: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const browseState = useContext(BrowseStateContext);

  const hotkeys = React.useMemo(
    () =>
      !browseState.editSecretVersion
        ? [
            {
              combo: "up",
              global: true,
              allowInInput: true,
              label: "Previous entry",
              onKeyDown: browseState.selectSecretUp,
            },
            {
              combo: "down",
              global: true,
              allowInInput: true,
              label: "Next entry",
              onKeyDown: browseState.selectSecretDown,
            },
            {
              combo: "ctrl + a",
              global: true,
              allowInInput: true,
              preventDefault: true,
              label: "Copy username/password/totp",
              onKeyDown: () =>
                browseState.copySecretProperties([
                  "username",
                  "password",
                  "totpUrl",
                ]),
            },
            {
              combo: "ctrl + u",
              global: true,
              allowInInput: true,
              label: "Copy username",
              onKeyDown: () => browseState.copySecretProperties(["username"]),
            },
            {
              combo: "ctrl + p",
              global: true,
              allowInInput: true,
              label: "Copy username",
              onKeyDown: () => browseState.copySecretProperties(["password"]),
            },
            {
              combo: "ctrl + o",
              global: true,
              allowInInput: true,
              label: "Copy totp",
              onKeyDown: () => browseState.copySecretProperties(["totpUrl"]),
            },
          ]
        : [],
    [
      browseState.selectSecretUp,
      browseState.selectSecretDown,
      browseState.copySecretProperties,
      browseState.editSecretVersion,
    ],
  );
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

  return (
    <>
      <ListSecrets onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
      <ClipboardControl />
    </>
  );
};
