import * as React from "react";
import { Navbar, InputGroup, Button, ProgressBar, Tooltip } from "@blueprintjs/core";
import { Grid } from "./ui/grid";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { translations } from "../i18n";

export const ListSecretsHeader: React.FunctionComponent = () => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useService(mainInterpreter);

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
        <Tooltip content={translate.action.config}>
          <Button icon="cog" large minimal onClick={() => send({ type: "OPEN_CONFIG" })} />
        </Tooltip>
        <Grid columns={1}>
          <Tooltip content={translate.action.autolockIn(state.context.autolockIn)}>
            <Button icon="lock" onClick={() => { send({ type: "LOCK" }) }}>
              {translate.action.lock}
            </Button>
          </Tooltip>
          <ProgressBar stripes={false} animate={false} value={state.context.autolockIn / state.context.autolockTimeout} />
        </Grid>
      </Navbar.Group>
    </Navbar>
  )
};