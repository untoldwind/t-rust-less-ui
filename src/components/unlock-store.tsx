import React from "react";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { HTMLSelect, InputGroup, Button, Toast2, Tabs, Tab, Callout, NonIdealState, OverlayToaster } from "@blueprintjs/core";
import { Muted } from "./ui/muted";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { appVersionState, errorState, identitiesState, mainPanelState, selectedStoreState, storeConfigsState, useTranslate } from "../machines/state";
import { useTryUnlock } from "../machines/actions";

export const UnlockStore: React.FC = () => {
  const translate = useTranslate();
  const appVersion = useRecoilValue(appVersionState);
  const storeConfigs = useRecoilValue(storeConfigsState);
  const setMainPanel = useSetRecoilState(mainPanelState);
  const [selectedStore, setSelectedStore] = useRecoilState(selectedStoreState);
  const identities = useRecoilValue(identitiesState);
  const [error, setError] = useRecoilState(errorState);
  const [tryUnlock, unlocking] = useTryUnlock();
  const [selectedIdentityId, setSelectedIdentityId] = React.useState(identities.length > 0 ? identities[0].id : undefined);
  const [passphrase, setPassphrase] = React.useState("");
  const isValid = passphrase.length > 0 && selectedIdentityId !== undefined;
  const loading = unlocking || error !== undefined;
  const passphraseRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSelectedIdentityId(identities.length > 0 ? identities[0].id : undefined);
  }, [identities]);
  React.useEffect(() => {
    passphraseRef.current?.focus();
  }, [selectedStore, passphraseRef.current?.disabled]);

  function onUnlock(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedIdentityId) return;

    tryUnlock(selectedIdentityId, passphrase);
    setPassphrase("");
  }

  if (storeConfigs.length === 0) {
    return (
      <NonIdealState
        title={translate.unlock.noStoresTitle}
        description={translate.unlock.noStoresDescription}
        action={<Button icon="cog" minimal onClick={() => setMainPanel("config")}>
          {translate.action.config}
        </Button>}
      />
    )
  }

  return (
    <Grid
      height={[100, '%']}
      columnSpec={[[1, 'fr'], [2, 'fr'], [1, 'fr']]}
      rowSpec="1fr min-content min-content 1fr min-content"
      rowGap={40}>
      <GridItem colSpan={3}>
        {error && <OverlayToaster>
          <Toast2 intent="danger" message={error} timeout={2000} onDismiss={() => setError(undefined)} />
        </OverlayToaster>}
      </GridItem>
      <GridItem colStart={2}>
        <Grid columns={1}>
          <Tabs large selectedTabId={selectedStore || ""} onChange={storeName => setSelectedStore(storeName.toString())}>
            {storeConfigs.map(storeConfig => (
              <Tab id={storeConfig.name} key={storeConfig.name} title={storeConfig.name} />
            ))}
          </Tabs>
          <Callout>
            <form onSubmit={onUnlock}>
              <Grid columns={1} gap={5}>
                <HTMLSelect value={selectedIdentityId} large disabled={loading}
                  onChange={event => setSelectedIdentityId(event.currentTarget.value)}>
                  {identities.map(identity => (
                    <option key={identity.id} value={identity.id}>
                      {identity.name} {`<${identity.email}>`}
                    </option>
                  ))}
                </HTMLSelect>
                <InputGroup type="password" leftIcon="key" large autoFocus value={passphrase} disabled={loading} inputRef={passphraseRef}
                  onChange={event => setPassphrase(event.currentTarget.value)} />
                <Button type="submit" icon="unlock" intent="success" large loading={loading} disabled={!isValid}>
                  {translate.action.unlock}
                </Button>
              </Grid>
            </form>
          </Callout>
        </Grid>
      </GridItem>
      <GridItem colStart={2} justifySelf="end">
        <Button icon="cog" minimal onClick={() => setMainPanel("config")}>
          {translate.action.config}
        </Button>
      </GridItem>
      <div />
      <GridItem colSpan={3} />
      <GridItem colSpan={3} justifySelf="center">
        <Muted>t-rust-less {appVersion.version} - tauri {appVersion.tauriVersion}</Muted>
      </GridItem>

    </Grid>
  )
};
