import React from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { selectedSecretState, selectedSecretVersionIdState, useTranslate } from "../machines/state";
import { useRecoilState, useRecoilValue } from "recoil";

export const SecretVersionSelect: React.FC = () => {
  const translate = useTranslate()
  const currentSecret = useRecoilValue(selectedSecretState);
  const [selectedSecretVersionId, setSelectedSecretVersionId] = useRecoilState(selectedSecretVersionIdState);

  if (!currentSecret) return null;

  const currentBlockId = selectedSecretVersionId ? selectedSecretVersionId : currentSecret.current_block_id;

  function renderMenu() {
    return (
      <Menu>
        {currentSecret?.versions.map(versionRef => (
          <MenuItem
            key={versionRef.block_id}
            active={currentBlockId === versionRef.block_id}
            label={translate.formatTimestamp(versionRef.timestamp)}
            onClick={() => setSelectedSecretVersionId(versionRef.block_id)}
          />
        ))}
      </Menu>
    )
  }

  const idx = currentSecret.versions.findIndex(versionRef => versionRef.block_id === currentBlockId);

  return (
    <ButtonGroup>
      <Button
        icon="chevron-left"
        disabled={idx >= currentSecret.versions.length - 1}
        onClick={() => {
          idx < currentSecret.versions.length - 1 && setSelectedSecretVersionId(currentSecret.versions[idx + 1].block_id);
        }} />
      <Popover2 content={renderMenu()}>
        <Button text={translate.formatTimestamp(currentSecret.current.timestamp)} rightIcon="caret-down" />
      </Popover2>
      <Button
        icon="chevron-right"
        disabled={idx <= 0}
        onClick={() => {
          idx > 0 && setSelectedSecretVersionId(currentSecret.versions[idx - 1].block_id);
        }} />
    </ButtonGroup>
  )
}