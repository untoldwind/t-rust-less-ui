import { Button, Dialog, InputGroup } from "@blueprintjs/core";
import { useActor } from "@xstate/react";
import * as React from "react";
import { Identity } from "../machines/backend-tauri";
import { translations } from "../i18n";
import { mainInterpreter } from "../machines/main";
import { PasswordInput } from "./password-input";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { NoWrap } from "./ui/nowrap";

export const ConfigAddIdentity: React.FC = () => {
  const translate = React.useMemo(translations, [translations]);
  const [, send] = useActor(mainInterpreter);
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

  function onCreate() {
    const identity: Identity = {
      id: "",
      name,
      email,
      hidden: false,
    };

    send({ type: "ADD_IDENTITY", identity, passphrase });
    onClose();
  }

  const isValid = name.length > 0 && email.length > 0 && passphrase.length > 0;

  return (
    <>
      <Button icon="add" minimal large onClick={() => setIsOpen(true)} />
      <Dialog autoFocus lazy title={translate.storeConfig.addIdentity} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Grid columnSpec="min-content 1fr" padding={[20, 10, 0, 10]} gap={5} alignItems="center">
          <NoWrap>{translate.storeConfig.identityName}</NoWrap>
          <InputGroup value={name} fill
            onChange={(event: React.FormEvent<HTMLInputElement>) => setName(event.currentTarget.value)} />
          <NoWrap>{translate.storeConfig.identityEmail}</NoWrap>
          <InputGroup value={email} fill
            onChange={(event: React.FormEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)} />
          <NoWrap>{translate.storeConfig.identityPassphrase}</NoWrap>
          <PasswordInput password={passphrase} onChange={setPassphrase} />
          <GridItem colSpan={2}>
            <Flex flexDirection="row" padding={[10, 0, 0, 0]}>
              <Button onClick={onClose}>{translate.action.cancel}</Button>
              <FlexItem flexGrow={1} />
              <Button intent="primary" disabled={!isValid} onClick={onCreate}>{translate.action.create}</Button>
            </Flex>
          </GridItem>
        </Grid>
      </Dialog>
    </>
  );
}