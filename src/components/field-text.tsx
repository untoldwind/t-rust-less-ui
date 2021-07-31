import * as React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Button } from "@blueprintjs/core";
import { NoWrap } from "./ui/nowrap";

export interface FieldTextProps {
  label: string
  value: string
  onCopy?: () => void
}

export const FieldText: React.FC<FieldTextProps> = React.memo(({ label, value, onCopy }) => {
  return (
    <>
      <NoWrap>{label}</NoWrap>
      <Flex flexDirection="row" gap={5}>
        <FlexItem flexGrow={1}>{value}</FlexItem>
        {onCopy && <FlexItem flexGrow={0}><Button icon="clipboard" minimal onClick={onCopy} /></FlexItem>}
      </Flex>
    </>
  );
});