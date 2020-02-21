import * as React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { InputGroup } from "@blueprintjs/core";

export interface FieldEditTextProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditText: React.FunctionComponent<FieldEditTextProps> = props => {
  const { label, value, onChange } = props;

  return (
    <Flex flexDirection="row" gap={5}>
      <FlexItem flexGrow={0} flexBasis={[10, '%']}>{label}</FlexItem>
      <FlexItem flexGrow={1}>
        <InputGroup value={value} onChange={(event: React.FormEvent<HTMLElement>) => onChange((event.target as HTMLInputElement).value)} />
      </FlexItem>
    </Flex>
  )
}

