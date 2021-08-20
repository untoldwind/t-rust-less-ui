import React from "react";
import { Navbar, InputGroup, Button, ProgressBar } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { Grid } from "./ui/grid";
import { autolockInState, mainPanelState, secretListFilterNameState, useTranslate } from "../machines/state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useLock, useSecretNavigate } from "../machines/actions";

export const ListSecretsHeader: React.FC = () => {
  const translate = useTranslate();
  const lock = useLock();
  const [secretListFilterName, setSecretListFilterName] = useRecoilState(secretListFilterNameState);
  const { secretUp, secretDown } = useSecretNavigate();
  const { autolockIn, autolockTimeout } = useRecoilValue(autolockInState);
  const setMainPanel = useSetRecoilState(mainPanelState);

  function onChangeNameFilter(event: React.FormEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;

    setSecretListFilterName(value.length > 0 ? value : undefined);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        secretDown();
        break;
      case "ArrowUp":
        secretUp();
        break;
    }
  }

  return (
    <Navbar>
      <Navbar.Group align="left">
        <InputGroup
          leftIcon="search" autoFocus
          value={secretListFilterName || ""}
          onChange={onChangeNameFilter}
          onKeyDown={onKeyDown} />
      </Navbar.Group>
      <Navbar.Group align="right">
        <Tooltip2 content={translate.action.config}>
          <Button icon="cog" large minimal onClick={() => setMainPanel("config")} />
        </Tooltip2>
        <Grid columns={1}>
          <Tooltip2 content={translate.action.autolockIn(autolockIn)}>
            <Button icon="lock" onClick={lock}>
              {translate.action.lock}
            </Button>
          </Tooltip2>
          <ProgressBar stripes={false} animate={false} value={autolockIn / autolockTimeout} />
        </Grid>
      </Navbar.Group>
    </Navbar>
  )
};