import React, { useContext } from "react";
import { Button, Card, H2, H4, Icon } from "@blueprintjs/core";
import { StoreConfig } from "../contexts/backend-tauri";
import { ConfigAddStore } from "./config-add-store";
import { ConfigIdentitiesList } from "./config-identities-list";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { Muted } from "./ui/muted";
import { NoWrap } from "./ui/nowrap";
import { TranslationsContext } from "../i18n";
import { MainStateContext } from "../contexts/main-state";
import { Loading } from "./loading";

export const Configuration: React.FC = () => {
  const mainState = useContext(MainStateContext);
  const translate = useContext(TranslationsContext);

  function renderStoreConfig(storeConfig: StoreConfig, idx: number) {
    const selected = storeConfig.name == mainState.selectedStore;
    const storeUrl = new URL(storeConfig.store_url);

    return (
      <Card
        key={idx}
        interactive={!selected}
        elevation={selected ? 2 : 0}
        onClick={(event) => {
          !selected && mainState.setSelectedStore(storeConfig.name);
        }}
      >
        <Grid columnSpec="min-content 1fr" rowGap={5} colGap={10}>
          <GridItem colSpan={2}>
            <Grid columnSpec="1fr min-content">
              <H4>{storeConfig.name}</H4>
              {storeConfig.name === mainState.defaultStore && (
                <Icon icon="star" />
              )}
              {storeConfig.name !== mainState.defaultStore && (
                <Button
                  icon="star-empty"
                  minimal
                  onClick={(event) => {
                    event.stopPropagation();
                    mainState.setDefaultStore(storeConfig.name);
                  }}
                />
              )}
            </Grid>
          </GridItem>
          <NoWrap>{translate.storeConfig.directory}</NoWrap>
          <Muted>{storeUrl.pathname}</Muted>
          <NoWrap>{translate.storeConfig.autolockTimeout}</NoWrap>
          <Muted>
            {storeConfig.autolock_timeout_secs}{" "}
            {translate.storeConfig.autolockTimeoutUnit}
          </Muted>
          <NoWrap>{translate.storeConfig.type}</NoWrap>
          <Muted>
            {storeUrl.protocol.substring(0, storeUrl.protocol.length - 1)}
          </Muted>
          <NoWrap>{translate.storeConfig.clientId}</NoWrap>
          <Muted>{storeConfig.client_id}</Muted>
          {selected && (
            <GridItem colSpan={2}>
              <ConfigIdentitiesList />
            </GridItem>
          )}
        </Grid>
      </Card>
    );
  }

  return (
    <Grid columns={1} rowSpec="min-content 1fr min-content" height={[100, "%"]}>
      <GridItem justifySelf="end">
        <Button
          icon="cross"
          large
          minimal
          onClick={() => mainState.setMainPanel("unlock")}
        />
      </GridItem>
      <GridItem overflow="auto">
        <Grid columns={1} padding={10} rowGap={10}>
          <H2>Stores</H2>
          {mainState.busy && <Loading />}
          {mainState.stores.map(renderStoreConfig)}
          <GridItem justifySelf="center">
            <ConfigAddStore />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem justifySelf="center">
        <Muted>
          t-rust-less {mainState.appVersion.version} - tauri{" "}
          {mainState.appVersion.tauriVersion}
        </Muted>
      </GridItem>
    </Grid>
  );
};
