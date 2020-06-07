import * as React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Button } from "@blueprintjs/core";

export interface FieldTextProps {
  label: string
  value: string
  onCopy?: () => void
}

export const FieldText: React.FunctionComponent<FieldTextProps> = props => {
  return (
    <>
      <div>{props.label}</div>
      <Flex flexDirection="row" gap={5}>
        <FlexItem flexGrow={1}>{props.value}</FlexItem>
        {props.onCopy && <FlexItem flexGrow={0}><Button icon="clipboard" minimal onClick={props.onCopy} /></FlexItem>}
      </Flex>
    </>
  );
};