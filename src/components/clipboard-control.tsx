import { Classes, Dialog } from "@blueprintjs/core";
import React from "react";
import { useClipboardControl } from "../machines/actions";
import { useTranslate } from "../machines/state";
import { Grid } from "./ui/grid";

export const ClipboardControl: React.FC = () => {
  const translate = useTranslate();
  const [currentlyProviding, _, destroyClipboard] = useClipboardControl();

  return (
    <Dialog isOpen={currentlyProviding !== null} onClose={destroyClipboard} title={translate.clipboard.controlTitle} usePortal isCloseButtonShown canEscapeKeyClose canOutsideClickClose>
      <div className={Classes.DIALOG_BODY}>
        <Grid columnSpec="min-content 1fr" gap={10}>
          <div>{translate.clipboard.secretName}</div>
          <div>{currentlyProviding?.secret_name}</div>
          <div>{translate.clipboard.property}</div>
          <div>{currentlyProviding && translate.secret.property(currentlyProviding.property)}</div>
        </Grid>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        </div>
      </div>
    </Dialog>
  )
}