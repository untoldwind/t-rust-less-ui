import React, { useContext } from "react";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import {
  HTMLSelect,
  InputGroup,
  Button,
  Tabs,
  Tab,
  Callout,
  NonIdealState,
} from "@blueprintjs/core";
import { Muted } from "./ui/muted";
import { TranslationsContext } from "../i18n";
import { MainStateContext } from "../contexts/main-state";

export const UnlockStore: React.FC = () => {
  const mainState = useContext(MainStateContext);
  const translate = useContext(TranslationsContext);
  const [selectedIdentityId, setSelectedIdentityId] = React.useState(
    mainState.identities.length > 0 ? mainState.identities[0].id : undefined,
  );
  const [passphrase, setPassphrase] = React.useState("");
  const isValid = passphrase.length > 0 && selectedIdentityId !== undefined;
  const passphraseRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSelectedIdentityId(
      mainState.identities.length > 0 ? mainState.identities[0].id : undefined,
    );
  }, [mainState.identities]);
  React.useEffect(() => {
    passphraseRef.current?.focus();
  }, [mainState.selectedStore, passphraseRef.current?.disabled]);

  function onUnlock(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!mainState.selectedStore || !selectedIdentityId) return;

    mainState.tryUnlock(selectedIdentityId, passphrase);
    setPassphrase("");
  }

  if (mainState.stores.length === 0) {
    return (
      <NonIdealState
        title={translate.unlock.noStoresTitle}
        description={translate.unlock.noStoresDescription}
        action={
          <Button
            icon="cog"
            minimal
            onClick={() => mainState.setMainPanel("config")}
          >
            {translate.action.config}
          </Button>
        }
      />
    );
  }

  return (
    <Grid
      height={[100, "%"]}
      columnSpec={[
        [1, "fr"],
        [2, "fr"],
        [1, "fr"],
      ]}
      rowSpec="1fr min-content min-content 1fr min-content"
      rowGap={40}
    >
      <GridItem colSpan={3} />
      <GridItem colStart={2}>
        <Grid columns={1}>
          <Tabs
            large
            selectedTabId={mainState.selectedStore || ""}
            onChange={(storeName) =>
              mainState.setSelectedStore(storeName.toString())
            }
          >
            {mainState.stores.map((storeConfig) => (
              <Tab
                id={storeConfig.name}
                key={storeConfig.name}
                title={storeConfig.name}
              />
            ))}
          </Tabs>
          <Callout>
            <form onSubmit={onUnlock}>
              <Grid columns={1} gap={5}>
                <HTMLSelect
                  value={selectedIdentityId}
                  large
                  disabled={mainState.busy}
                  onChange={(event) =>
                    setSelectedIdentityId(event.currentTarget.value)
                  }
                >
                  {mainState.identities.map((identity) => (
                    <option key={identity.id} value={identity.id}>
                      {identity.name} {`<${identity.email}>`}
                    </option>
                  ))}
                </HTMLSelect>
                <InputGroup
                  type="password"
                  leftIcon="key"
                  large
                  autoFocus
                  value={passphrase}
                  disabled={mainState.busy}
                  inputRef={passphraseRef}
                  onChange={(event) => setPassphrase(event.currentTarget.value)}
                />
                <Button
                  type="submit"
                  icon="unlock"
                  intent="success"
                  large
                  loading={mainState.busy}
                  disabled={!isValid}
                >
                  {translate.action.unlock}
                </Button>
              </Grid>
            </form>
          </Callout>
        </Grid>
      </GridItem>
      <GridItem colStart={2} justifySelf="end">
        <Button
          icon="cog"
          minimal
          onClick={() => mainState.setMainPanel("config")}
        >
          {translate.action.config}
        </Button>
      </GridItem>
      <div />
      <GridItem colSpan={3} />
      <GridItem colSpan={3} justifySelf="center">
        <Muted>
          t-rust-less {mainState.appVersion.version} - tauri{" "}
          {mainState.appVersion.tauriVersion}
        </Muted>
      </GridItem>
    </Grid>
  );
};
