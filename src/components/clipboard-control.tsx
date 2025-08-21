import { Button, Classes, Dialog } from "@blueprintjs/core";
import React, { useContext } from "react";
import { Grid } from "./ui/grid";
import { TranslationsContext } from "../i18n";
import { BrowseStateContext } from "../contexts/browse-state";

export const ClipboardControl: React.FC = () => {
  const translate = useContext(TranslationsContext);
  const browseState = useContext(BrowseStateContext);

  return (
    <Dialog
      isOpen={browseState.clipboardProviding !== null}
      onClose={() => browseState.clipboardDestroy()}
      title={translate.clipboard.controlTitle}
      icon="paperclip"
      usePortal
      canEscapeKeyClose
      canOutsideClickClose
      shouldReturnFocusOnClose
    >
      <div className={Classes.DIALOG_BODY}>
        <Grid columnSpec="1fr 1fr" gap={10} width={[100, "%"]}>
          <div>{translate.clipboard.secretName}</div>
          <div>{browseState.clipboardProviding?.secret_name}</div>
          <div>{translate.clipboard.property}</div>
          <div>
            {browseState.clipboardProviding &&
              translate.secret.property(
                browseState.clipboardProviding.property,
              )}
          </div>
        </Grid>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={() => browseState.clipboardDestroy()}>
            {translate.clipboard.cancelButton}
          </Button>
          <Button
            intent="primary"
            onClick={() => browseState.clipboardProvideNext()}
          >
            {translate.clipboard.nextButton}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
