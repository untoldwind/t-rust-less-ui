import React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Button } from "@blueprintjs/core";
import { NoWrap } from "./ui/nowrap";

export interface FieldTextProps {
  label: string
  value: string
  onZoom?: () => void
  onCopy?: () => void
}

export const FieldText: React.FC<FieldTextProps> = React.memo(({ label, value, onZoom, onCopy }) => {
  return (
    <>
      <NoWrap>{label}</NoWrap>
      <Flex flexDirection="row" gap={5}>
        <FlexItem flexGrow={1}>{value}</FlexItem>
        <FlexItem flexGrow={0}>
          <Flex flexDirection="row">
            {onZoom && <Button icon="zoom-in" minimal onClick={onZoom} />}
            {onCopy && <Button icon="clipboard" minimal onClick={onCopy} />}
          </Flex>
        </FlexItem>
      </Flex>
    </>
  );
});