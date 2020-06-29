import * as React from "react";
import { InputGroup } from "@blueprintjs/core";

export interface FieldEditTextProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditText: React.FunctionComponent<FieldEditTextProps> = props => {
  const { label, value, onChange } = props;

  return (
    <>
      <div>{label}</div>
      <InputGroup value={value} fill
        onChange={(event: React.FormEvent<HTMLElement>) => onChange((event.target as HTMLInputElement).value)} />
    </>
  )
}

