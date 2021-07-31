import { Button, Dialog, InputGroup, NumericInput, Tag, Tooltip } from "@blueprintjs/core";
import { useService } from "@xstate/react";
import * as React from "react";
import { translations } from "../i18n";
import { selectStoreLocation, StoreConfig } from "../machines/backend-tauri";
import { mainInterpreter } from "../machines/main";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { NoWrap } from "./ui/nowrap";

export const ConfigAddStore: React.FunctionComponent = () => {
  const translate = React.useMemo(translations, [translations]);
  const [, send] = useService(mainInterpreter);
  const [isOpen, setIsOpen] = React.useState(false);
  const [storeName, setStoreName] = React.useState("");
  const [directory, setDirectory] = React.useState("");
  const [autolockTimeout, setAutolockTimeout] = React.useState(300);
  const [isDirectorySelectOpen, setIsDirectorSelectOpen] = React.useState(false);

  function selectDirectory() {
    if (isDirectorySelectOpen) return;

    setIsDirectorSelectOpen(true);
    selectStoreLocation(directory.length > 0 ? directory : undefined).then(selected => {
      if (selected !== null) setDirectory(selected);
      setIsDirectorSelectOpen(false);
    },
      () => setIsDirectorSelectOpen(false))
  }

  function onClose() {
    setStoreName("");
    setDirectory("");
    setAutolockTimeout(300);
    setIsDirectorSelectOpen(false);
    setIsOpen(false);
  }

  function onCreate() {
    let store_url = encodeURI("multilane+file://" + directory);

    if (!store_url.endsWith("/")) store_url += "/";

    const storeConfig: StoreConfig = {
      name: storeName,
      store_url,
      client_id: "",
      autolock_timeout_secs: autolockTimeout,
    };

    send({ type: "SAVE_CONFIG", storeConfig });
    onClose();
  }

  const isValid = storeName.length > 0 && directory.length > 0;

  return (
    <>
      <Tooltip content={translate.storeConfig.addStore}>
        <Button icon="add" large minimal onClick={() => setIsOpen(true)} />
      </Tooltip>
      <Dialog autoFocus lazy title={translate.storeConfig.addStore} isOpen={isOpen} onClose={onClose}>
        <Grid columnSpec="min-content 1fr" padding={[20, 10, 0, 10]} gap={5} alignItems="center">
          <NoWrap>{translate.storeConfig.storeName}</NoWrap>
          <InputGroup value={storeName} fill
            onChange={(event: React.FormEvent<HTMLInputElement>) => setStoreName(event.currentTarget.value)} />
          <NoWrap>{translate.storeConfig.directory}</NoWrap>
          <InputGroup value={directory} fill
            rightElement={<Button icon="folder-open" minimal disabled={isDirectorySelectOpen} onClick={selectDirectory} />}
            onChange={(event: React.FormEvent<HTMLInputElement>) => setDirectory(event.currentTarget.value)} />
          <NoWrap>{translate.storeConfig.autolockTimeout}</NoWrap>
          <NumericInput defaultValue={autolockTimeout} min={0} stepSize={10} fill
            rightElement={<Tag minimal>{translate.storeConfig.autolockTimeoutUnit}</Tag>}
            onValueChange={value => setAutolockTimeout(value)} />
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
  )
}