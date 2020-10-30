import { Button, Card, H2, H4, Icon, Toast, Toaster } from "@blueprintjs/core";
import { TEXT_MUTED } from "@blueprintjs/core/lib/esm/common/classes";
import { useService } from "@xstate/react";
import * as React from "react";
import { StoreConfig } from "../../../native";
import { translations } from "../i18n";
import { mainInterpreter } from "../machines/main";
import { ConfigAddStore } from "./config-add-store";
import { ConfigIdentitiesList } from "./config-identities-list";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { NoWrap } from "./ui/nowrap";

export const Configuration: React.FunctionComponent = () => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useService(mainInterpreter);

  function renderStoreConfig(storeConfig: StoreConfig, idx: number) {
    const selected = storeConfig.name == state.context.selectedStoreConfig?.name;
    const storeUrl = new URL(storeConfig.store_url);

    return (
      <Card key={idx}
        interactive={!selected}
        elevation={selected ? 2 : 0}
        onClick={event => { !selected && send({ type: "SELECT_STORE", storeName: storeConfig.name }) }}>
        <Grid columnSpec="min-content 1fr" rowGap={5} colGap={10}>
          <GridItem colSpan={2}>
            <Grid columnSpec="1fr min-content">
              <H4>{storeConfig.name}</H4>
              {storeConfig.name === state.context.defaultStoreName && <Icon icon="star" />}
              {storeConfig.name !== state.context.defaultStoreName && <Button icon="star-empty" minimal
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  send({ type: "SET_DEFAULT_STORE", storeName: storeConfig.name });
                }} />}
            </Grid>
          </GridItem>
          <NoWrap>{translate.storeConfig.directory}</NoWrap>
          <div className={TEXT_MUTED}>{storeUrl.pathname.substring(2)}</div>
          <NoWrap>{translate.storeConfig.autolockTimeout}</NoWrap>
          <div className={TEXT_MUTED}>{storeConfig.autolock_timeout_secs} {translate.storeConfig.autolockTimeoutUnit}</div>
          <NoWrap>{translate.storeConfig.type}</NoWrap>
          <div className={TEXT_MUTED}>{storeUrl.protocol.substring(0, storeUrl.protocol.length - 1)}</div>
          <NoWrap>{translate.storeConfig.clientId}</NoWrap>
          <div className={TEXT_MUTED}>{storeConfig.client_id}</div>
          {selected && <GridItem colSpan={2}><ConfigIdentitiesList /></GridItem>}
        </Grid>
      </Card>
    )
  }

  return (
    <Grid columns={1} padding={10} rowGap={10}>
      <GridItem justifySelf="end">
        <Button icon="cross" large minimal onClick={() => send({ type: "CLOSE_CONFIG" })} />
      </GridItem>
      {state.matches("config.error") && <GridItem>
        <Toaster>
          <Toast
            intent="danger"
            message={state.context.errorMessage}
            timeout={2000}
            onDismiss={() => send({ type: "CONFIRM_ERROR" })} />
        </Toaster>
      </GridItem>}
      <H2>Stores</H2>
      {state.context.storeConfigs.map(renderStoreConfig)}
      <GridItem justifySelf="center">
        <ConfigAddStore />
      </GridItem>
    </Grid>
  );
}