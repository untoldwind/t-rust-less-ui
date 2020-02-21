import * as React from "react";
import { Flex } from "./ui/flex";
import { Button } from "@blueprintjs/core";

export interface FieldNoteProps {
  label: string
  value: string
  onCopy: () => void
}

export const FieldNote: React.FunctionComponent<FieldNoteProps> = props => {
  return (
    <Flex flexDirection="row" gap={5}>
      <div>{props.label}</div>
      <div>{props.value}</div>
      <Button icon="clipboard" minimal onClick={props.onCopy} />
    </Flex>
  )
}