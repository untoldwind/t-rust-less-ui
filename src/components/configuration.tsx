import React from "react";
import { Button, Card, H2, H4, Icon, OverlayToaster, Toast2 } from "@blueprintjs/core";
import { StoreConfig } from "../machines/backend-tauri";
import { ConfigAddStore } from "./config-add-store";
import { ConfigIdentitiesList } from "./config-identities-list";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { Muted } from "./ui/muted";
import { NoWrap } from "./ui/nowrap";
import { appVersionState, defaultStoreNameState, errorState, mainPanelState, selectedStoreState, storeConfigsState, useTranslate } from "../machines/state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useUpdateDefaultStoreName } from "../machines/actions";

export const Configuration: React.FC = () => {
  const translate = useTranslate();
  const appVersion = useRecoilValue(appVersionState);
  const storeConfigs = useRecoilValue(storeConfigsState);
  const [selectedStore, setSelectedStore] = useRecoilState(selectedStoreState);
  const setMainPanel = useSetRecoilState(mainPanelState);
  const defaultStoreName = useRecoilValue(defaultStoreNameState);
  const [error, setError] = useRecoilState(errorState);
  const updateDefaultStoreName = useUpdateDefaultStoreName();

  function renderStoreConfig(storeConfig: StoreConfig, idx: number) {
    const selected = storeConfig.name == selectedStore;
    const storeUrl = new URL(storeConfig.store_url);

    return (
      <Card key={idx}
        interactive={!selected}
        elevation={selected ? 2 : 0}
        onClick={event => { !selected && setSelectedStore(storeConfig.name) }}>
        <Grid columnSpec="min-content 1fr" rowGap={5} colGap={10}>
          <GridItem colSpan={2}>
            <Grid columnSpec="1fr min-content">
              <H4>{storeConfig.name}</H4>
              {storeConfig.name === defaultStoreName && <Icon icon="star" />}
              {storeConfig.name !== defaultStoreName && <Button icon="star-empty" minimal
                onClick={event => {
                  event.stopPropagation();
                  updateDefaultStoreName(storeConfig.name);
                }} />}
            </Grid>
          </GridItem>
          <NoWrap>{translate.storeConfig.directory}</NoWrap>
          <Muted>{storeUrl.pathname}</Muted>
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
        <Button icon="cross" large minimal onClick={() => setMainPanel("unlock")} />
      </GridItem>
      <GridItem overflow="auto">
        <Grid columns={1} padding={10} rowGap={10}>
          {error && <GridItem>
            <OverlayToaster>
              <Toast2 intent="danger" message={error} timeout={2000} onDismiss={() => setError(undefined)} />
            </OverlayToaster>
          </GridItem>}
          <H2>Stores</H2>
          {storeConfigs.map(renderStoreConfig)}
          <GridItem justifySelf="center">
            <ConfigAddStore />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem justifySelf="center">
        <Muted>t-rust-less {appVersion.version} - tauri {appVersion.tauriVersion}</Muted>
      </GridItem>
    </Grid>
  );
}