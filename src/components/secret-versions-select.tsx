import React, { useContext } from "react";
import {
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Popover,
} from "@blueprintjs/core";
import { TranslationsContext } from "../i18n";
import { Secret } from "../contexts/backend-tauri";
import { BrowseStateContext } from "../contexts/browse-state";

export interface SecretVersionSelectProps {
  secret: Secret;
}

export const SecretVersionSelect: React.FC<SecretVersionSelectProps> = ({
  secret,
}) => {
  const browseState = useContext(BrowseStateContext);
  const translate = useContext(TranslationsContext);

  const currentBlockId =
    browseState.selectedSecretVersion?.id ?? secret.current_block_id;

  function renderMenu() {
    return (
      <Menu>
        {secret.versions.map((versionRef) => (
          <MenuItem
            key={versionRef.block_id}
            active={currentBlockId === versionRef.block_id}
            text={translate.formatTimestamp(versionRef.timestamp)}
            onClick={() =>
              browseState.setSelectedSecretVersionId(versionRef.block_id)
            }
          />
        ))}
      </Menu>
    );
  }

  const idx = secret.versions.findIndex(
    (versionRef) => versionRef.block_id === currentBlockId,
  );

  return (
    <ButtonGroup>
      <Button
        icon="chevron-left"
        disabled={idx >= secret.versions.length - 1}
        onClick={() => {
          idx < secret.versions.length - 1 &&
            browseState.setSelectedSecretVersionId(
              secret.versions[idx + 1].block_id,
            );
        }}
      />
      <Popover content={renderMenu()}>
        <Button
          text={translate.formatTimestamp(secret.current.timestamp)}
          rightIcon="caret-down"
        />
      </Popover>
      <Button
        icon="chevron-right"
        disabled={idx <= 0}
        onClick={() => {
          idx > 0 &&
            browseState.setSelectedSecretVersionId(
              secret.versions[idx - 1].block_id,
            );
        }}
      />
    </ButtonGroup>
  );
};
