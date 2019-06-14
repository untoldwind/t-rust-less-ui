import * as React from "react";
import { FlexHorizontal, FlexItem } from "./ui/flex";
import { InputGroup } from "@blueprintjs/core";

export interface FieldEditTextProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditText: React.FunctionComponent<FieldEditTextProps> = props => {
  const { label, value, onChange } = props;

  return (
    <FlexHorizontal gap="md">
      <FlexItem grow={0} basis={[10, '%']}>{label}</FlexItem>
      <FlexItem grow={1}>
        <InputGroup value={value} onChange={(event: React.FormEvent<HTMLElement>) => onChange((event.target as HTMLInputElement).value)} />
      </FlexItem>
    </FlexHorizontal>
  )
}

