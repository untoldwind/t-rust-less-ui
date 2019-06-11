import * as React from "react";
import { FlexHorizontal } from "./ui/flex";
import { Button } from "@blueprintjs/core";

export interface FieldNoteProps {
  label: string
  value: string
}

export const FieldNote: React.FunctionComponent<FieldNoteProps> = props => {
  return (
    <FlexHorizontal>
      <div>{props.label}</div>
      <div>{props.value}</div>
      <Button icon="clipboard" minimal />
    </FlexHorizontal>
  )
}