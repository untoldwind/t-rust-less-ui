import * as React from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useActor } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { translations } from "../i18n";

export const SecretVersionSelect: React.FunctionComponent = () => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useActor(mainInterpreter);

  if (!state.matches("unlocked.display_secret")) return null;

  function renderMenu() {
    return (
      <Menu>
        {state.context.currentSecret?.versions.map(versionRef => (
          <MenuItem
            key={versionRef.block_id}
            active={state.context.currentBlockId === versionRef.block_id}
            label={translate.formatTimestamp(versionRef.timestamp)}
            onClick={() => send({ type: "SELECT_SECRET_VERSION", blockId: versionRef.block_id })}
          />
        ))}
      </Menu>
    )
  }

  const idx = state.context.currentSecret.versions.findIndex(versionRef => versionRef.block_id === state.context.currentBlockId);

  return (
    <ButtonGroup>
      <Button
        icon="chevron-left"
        disabled={idx >= state.context.currentSecret.versions.length - 1}
        onClick={() => {
          idx < state.context.currentSecret.versions.length - 1 && send({ type: "SELECT_SECRET_VERSION", blockId: state.context.currentSecret.versions[idx + 1].block_id })
        }} />
      <Popover2 content={renderMenu()}>
        <Button text={translate.formatTimestamp(state.context.currentSecret.current.timestamp)} rightIcon="caret-down" />
      </Popover2>
      <Button
        icon="chevron-right"
        disabled={idx <= 0}
        onClick={() => {
          idx > 0 && send({ type: "SELECT_SECRET_VERSION", blockId: state.context.currentSecret.versions[idx - 1].block_id })
        }} />
    </ButtonGroup>
  )
}