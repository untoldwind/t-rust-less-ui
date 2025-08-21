import React, { useContext } from "react";
import { Button, Dialog, InputGroup } from "@blueprintjs/core";
import { Identity } from "../contexts/backend-tauri";
import { PasswordInput } from "./password-input";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { NoWrap } from "./ui/nowrap";
import { TranslationsContext } from "../i18n";
import { MainStateContext } from "../contexts/main-state";

export const ConfigAddIdentity: React.FC = () => {
  const mainState = useContext(MainStateContext);
  const translate = useContext(TranslationsContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");

  function onClose() {
    setName("");
    setEmail("");
    setPassphrase("");
    setIsOpen(false);
  }

  async function onCreate() {
    if (!mainState.selectedStore) return;
    const identity: Identity = {
      id: "",
      name,
      email,
      hidden: false,
    };

    mainState.addIdentity(identity, passphrase, onClose);
  }

  const isValid = name.length > 0 && email.length > 0 && passphrase.length > 0;

  return (
    <>
      <Button icon="add" minimal large onClick={() => setIsOpen(true)} />
      <Dialog
        autoFocus
        lazy
        title={translate.storeConfig.addIdentity}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Grid
          columnSpec="min-content 1fr"
          padding={[20, 10, 0, 10]}
          gap={5}
          alignItems="center"
        >
          <NoWrap>{translate.storeConfig.identityName}</NoWrap>
          <InputGroup
            value={name}
            disabled={mainState.busy}
            fill
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <NoWrap>{translate.storeConfig.identityEmail}</NoWrap>
          <InputGroup
            value={email}
            disabled={mainState.busy}
            fill
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <NoWrap>{translate.storeConfig.identityPassphrase}</NoWrap>
          <PasswordInput
            password={passphrase}
            disabled={mainState.busy}
            onChange={setPassphrase}
          />
          <GridItem colSpan={2}>
            <Flex flexDirection="row" padding={[10, 0, 0, 0]}>
              <Button onClick={onClose}>{translate.action.cancel}</Button>
              <FlexItem flexGrow={1} />
              <Button
                intent="primary"
                loading={mainState.busy}
                disabled={!isValid}
                onClick={onCreate}
              >
                {translate.action.create}
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </Dialog>
    </>
  );
};
