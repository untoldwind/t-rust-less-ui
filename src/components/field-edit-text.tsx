import * as React from "react";
import { InputGroup } from "@blueprintjs/core";
import { NoWrap } from "./ui/nowrap";

export interface FieldEditTextProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditText: React.FunctionComponent<FieldEditTextProps> = ({ label, value, onChange }) => {
  return (
    <>
      <NoWrap>{label}</NoWrap>
      <InputGroup value={value} fill
        onChange={(event: React.FormEvent<HTMLInputElement>) => onChange(event.currentTarget.value)} />
    </>
  )
}

