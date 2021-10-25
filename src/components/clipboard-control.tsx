import { Alert } from "@blueprintjs/core";
import React from "react";
import { useClipboardControl } from "../machines/actions";
import { useTranslate } from "../machines/state";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";

export const ClipboardControl: React.FC = () => {
  const translate = useTranslate();
  const [currentlyProviding, provideNext, destroyClipboard] = useClipboardControl();

  return (
    <Alert isOpen={currentlyProviding !== null} onCancel={destroyClipboard} onConfirm={provideNext}
      cancelButtonText={translate.clipboard.cancelButton} confirmButtonText={translate.clipboard.nextButton}
      icon="paperclip" canEscapeKeyCancel canOutsideClickCancel>
      <Grid columnSpec="1fr 1fr" gap={10} width={[100, '%']}>
        <GridItem colSpan={2}>{translate.clipboard.controlTitle}</GridItem>
        <div>{translate.clipboard.secretName}</div>
        <div>{currentlyProviding?.secret_name}</div>
        <div>{translate.clipboard.property}</div>
        <div>{currentlyProviding && translate.secret.property(currentlyProviding.property)}</div>
      </Grid>
    </Alert>
  )
}