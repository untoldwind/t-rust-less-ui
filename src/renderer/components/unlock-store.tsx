import * as React from "react";
import { translations } from "../i18n";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { HTMLSelect, InputGroup, Button, Toaster, Toast, Tabs, Tab, Callout } from "@blueprintjs/core";

export const UnlockStore: React.FunctionComponent = () => {
  const translate = React.useMemo(translations, [translations])
  const [ownState, setOwnState] = React.useState({
    passphrase: "",
  });
  const [state, send] = useService(mainInterpreter);
  const isValid = ownState.passphrase.length > 0 && typeof state.context.selectedIdentity === "object";
  const passphraseRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    passphraseRef.current?.focus();
  }, [passphraseRef.current?.disabled]);

  function onUnlock(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();

    setOwnState({ passphrase: "" });
    isValid && send({ type: "TRY_UNLOCK", passphrase: ownState.passphrase });
  }

  return (
    <Grid
      height={[100, '%']}
      columnSpec={[[1, 'fr'], [2, 'fr'], [1, 'fr']]}
      rowSpec="1fr min-content min-content 1fr"
      rowGap={40}>
      <GridItem colSpan={3}>
        {state.matches("locked.error") && <Toaster>
          <Toast
            intent="danger"
            message={state.context.errorMessage}
            timeout={2000}
            onDismiss={() => send({ type: "CONFIRM_ERROR" })} />
        </Toaster>}
      </GridItem>
      <GridItem colStart={2}>
        <Grid columns={1}>
          <Tabs large selectedTabId={state.context.selectedStoreConfig?.name}
            onChange={storeName => send({ type: "SELECT_STORE", storeName: storeName.toString() })}>
            {state.context.storeConfigs.map(storeConfig => (
              <Tab id={storeConfig.name} key={storeConfig.name} title={storeConfig.name} />
            ))}
          </Tabs>
          <Callout>
            <form onSubmit={onUnlock}>
              <Grid columns={1} gap={5}>
                <HTMLSelect value={state.context.selectedIdentity?.id} large
                  disabled={!state.matches("locked.select_store")}
                  onChange={event => send({ type: "SELECT_IDENTITY", identityId: event.currentTarget.value })}>
                  {(state.context.identities || []).map(identity => (
                    <option key={identity.id} value={identity.id}>
                      {identity.name} {`<${identity.email}>`}
                    </option>
                  ))}
                </HTMLSelect>
                <InputGroup
                  type="password" leftIcon="key" large autoFocus
                  value={ownState.passphrase}
                  disabled={!state.matches("locked.select_store")}
                  inputRef={passphraseRef}
                  onChange={(event: React.FormEvent<HTMLInputElement>) => setOwnState({ passphrase: event.currentTarget.value })} />
                <Button
                  type="submit" icon="unlock" intent="success" large
                  loading={state.matches("locked.try_unlock")}
                  disabled={!isValid}>
                  {translate.action.unlock}
                </Button>
              </Grid>
            </form>
          </Callout>
        </Grid>
      </GridItem>
      <GridItem colStart={2} justifySelf="end">
        <Button icon="cog" minimal onClick={() => send({ type: "OPEN_CONFIG" })}>
          {translate.action.config}
        </Button>
      </GridItem>
    </Grid>
  )
};
