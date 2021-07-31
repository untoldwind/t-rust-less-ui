import { Button, Card, H2, H4, Icon, Toast, Toaster } from "@blueprintjs/core";
import { useActor } from "@xstate/react";
import * as React from "react";
import { StoreConfig } from "../machines/backend-tauri";
import { translations } from "../i18n";
import { mainInterpreter } from "../machines/main";
import { ConfigAddStore } from "./config-add-store";
import { ConfigIdentitiesList } from "./config-identities-list";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { Muted } from "./ui/muted";
import { NoWrap } from "./ui/nowrap";

export const Configuration: React.FC = () => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useActor(mainInterpreter);

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
          <Muted>{storeUrl.pathname.substring(2)}</Muted>
          <NoWrap>{translate.storeConfig.autolockTimeout}</NoWrap>
          <Muted>{storeConfig.autolock_timeout_secs} {translate.storeConfig.autolockTimeoutUnit}</Muted>
          <NoWrap>{translate.storeConfig.type}</NoWrap>
          <Muted>{storeUrl.protocol.substring(0, storeUrl.protocol.length - 1)}</Muted>
          <NoWrap>{translate.storeConfig.clientId}</NoWrap>
          <Muted>{storeConfig.client_id}</Muted>
          {selected && <GridItem colSpan={2}><ConfigIdentitiesList /></GridItem>}
        </Grid>
      </Card>
    )
  }

  return (
    <Grid columns={1} rowSpec="min-content 1fr min-content" height={[100, "%"]}>
      <GridItem justifySelf="end">
        <Button icon="cross" large minimal onClick={() => send({ type: "CLOSE_CONFIG" })} />
      </GridItem>
      <GridItem overflow="auto">
        <Grid columns={1} padding={10} rowGap={10}>
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
      </GridItem>
      <GridItem justifySelf="center">
        <Muted>t-rust-less {state.context.appVersion.version} - tauri {state.context.appVersion.tauriVersion}</Muted>
      </GridItem>
    </Grid>
  );
}