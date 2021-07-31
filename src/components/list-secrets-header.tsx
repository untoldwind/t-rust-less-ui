import * as React from "react";
import { Navbar, InputGroup, Button, ProgressBar } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { Grid } from "./ui/grid";
import { useActor } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { translations } from "../i18n";

export const ListSecretsHeader: React.FC = () => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useActor(mainInterpreter);

  function onChangeNameFilter(event: React.FormEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;

    send({
      type: "SET_SECRET_FILTER", secretFilter: {
        ...state.context.secretFilter,
        name: value.length > 0 ? value : undefined,
      },
    });
  }

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        send({ type: "SELECT_NEXT" });
        break;
      case "ArrowUp":
        send({ type: "SELECT_PREVIOUS" });
        break;
    }
  }

  if (!state.matches("unlocked")) return null;

  return (
    <Navbar>
      <Navbar.Group align="left">
        <InputGroup
          leftIcon="search" autoFocus
          value={state.context.secretFilter.name || ""}
          onChange={onChangeNameFilter}
          onKeyDown={onKeyDown} />
      </Navbar.Group>
      <Navbar.Group align="right">
        <Tooltip2 content={translate.action.config}>
          <Button icon="cog" large minimal onClick={() => send({ type: "OPEN_CONFIG" })} />
        </Tooltip2>
        <Grid columns={1}>
          <Tooltip2 content={translate.action.autolockIn(state.context.autolockIn)}>
            <Button icon="lock" onClick={() => { send({ type: "LOCK" }) }}>
              {translate.action.lock}
            </Button>
          </Tooltip2>
          <ProgressBar stripes={false} animate={false} value={state.context.autolockIn / state.context.autolockTimeout} />
        </Grid>
      </Navbar.Group>
    </Navbar>
  )
};