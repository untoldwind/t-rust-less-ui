import React from "react";
import { Button, Dialog, InputGroup } from "@blueprintjs/core";
import { Identity } from "../machines/backend-tauri";
import { useTranslate } from "../machines/state";
import { PasswordInput } from "./password-input";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { NoWrap } from "./ui/nowrap";
import { useAddIdentity } from "../machines/actions";

export const ConfigAddIdentity: React.FC = () => {
  const translate = useTranslate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const addIdentity = useAddIdentity();

  function onClose() {
    setName("");
    setEmail("");
    setPassphrase("");
    setAdding(false);
    setIsOpen(false);
  }

  async function onCreate() {
    const identity: Identity = {
      id: "",
      name,
      email,
      hidden: false,
    };

    setAdding(true);
    await addIdentity(identity, passphrase);
    onClose();
  }

  const isValid = name.length > 0 && email.length > 0 && passphrase.length > 0;

  return (
    <>
      <Button icon="add" minimal large onClick={() => setIsOpen(true)} />
      <Dialog autoFocus lazy title={translate.storeConfig.addIdentity} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Grid columnSpec="min-content 1fr" padding={[20, 10, 0, 10]} gap={5} alignItems="center">
          <NoWrap>{translate.storeConfig.identityName}</NoWrap>
          <InputGroup value={name} disabled={adding} fill onChange={event => setName(event.currentTarget.value)} />
          <NoWrap>{translate.storeConfig.identityEmail}</NoWrap>
          <InputGroup value={email} disabled={adding} fill onChange={event => setEmail(event.currentTarget.value)} />
          <NoWrap>{translate.storeConfig.identityPassphrase}</NoWrap>
          <PasswordInput password={passphrase} disabled={adding} onChange={setPassphrase} />
          <GridItem colSpan={2}>
            <Flex flexDirection="row" padding={[10, 0, 0, 0]}>
              <Button onClick={onClose}>{translate.action.cancel}</Button>
              <FlexItem flexGrow={1} />
              <Button intent="primary" loading={adding} disabled={!isValid} onClick={onCreate}>{translate.action.create}</Button>
            </Flex>
          </GridItem>
        </Grid>
      </Dialog>
    </>
  );
}