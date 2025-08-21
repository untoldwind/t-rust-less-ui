import React, { useContext, useEffect, useState } from "react";
import {
  Navbar,
  InputGroup,
  Button,
  ProgressBar,
  Tooltip,
} from "@blueprintjs/core";
import { Grid } from "./ui/grid";
import { TranslationsContext } from "../i18n";
import { BrowseStateContext } from "../contexts/browse-state";
import { MainStateContext } from "../contexts/main-state";
import moment from "moment";

type Autolock = {
  autoLockIn: number;
  autolockTimeout: number;
};

export const ListSecretsHeader: React.FC = () => {
  const mainState = useContext(MainStateContext);
  const browseState = useContext(BrowseStateContext);
  const translate = useContext(TranslationsContext);
  const [autolock, setAutolock] = useState<Autolock>({
    autoLockIn: 0,
    autolockTimeout: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (mainState.status.locked) {
        setAutolock({ autoLockIn: 0, autolockTimeout: 0 });
      } else {
        const autoLockIn =
          moment(mainState.status.autolock_at).diff(moment()) / 1000.0;
        setAutolock({
          autoLockIn: autoLockIn < 0 ? 0 : autoLockIn,
          autolockTimeout: mainState.status.autolock_timeout,
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [mainState.status]);

  function onChangeNameFilter(event: React.FormEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;

    browseState.setSecretListFilterName(value.length > 0 ? value : undefined);
  }

  return (
    <Navbar>
      <Navbar.Group align="left">
        <InputGroup
          leftIcon="search"
          autoFocus
          value={browseState.secretListFilter.name ?? ""}
          onChange={onChangeNameFilter}
        />
      </Navbar.Group>
      <Navbar.Group align="right">
        <Tooltip content={translate.action.config}>
          <Button
            icon="cog"
            large
            minimal
            onClick={() => mainState.setMainPanel("config")}
          />
        </Tooltip>
        <Grid columns={1}>
          <Tooltip content={translate.action.autolockIn(autolock.autoLockIn)}>
            <Button icon="lock" onClick={() => mainState.lock()}>
              {translate.action.lock}
            </Button>
          </Tooltip>
          <ProgressBar
            stripes={false}
            animate={false}
            value={autolock.autoLockIn / autolock.autolockTimeout}
          />
        </Grid>
      </Navbar.Group>
    </Navbar>
  );
};
