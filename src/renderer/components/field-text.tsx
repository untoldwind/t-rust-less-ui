import * as React from "react";
import { FlexHorizontal, FlexItem } from "./ui/flex";
import { Button } from "@blueprintjs/core";

export interface FieldTextProps {
  label: string
  value: string
}

export const FieldText: React.FunctionComponent<FieldTextProps> = props => {
  return (
    <FlexHorizontal gap="md">
      <FlexItem grow={0} basis={[10, '%']}>{props.label}</FlexItem>
      <FlexItem grow={1}>{props.value}</FlexItem>
      <FlexItem grow={0}><Button icon="clipboard" minimal /></FlexItem>
    </FlexHorizontal>
  );
};