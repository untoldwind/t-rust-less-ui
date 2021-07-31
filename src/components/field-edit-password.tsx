import * as React from "react";
import { PasswordInput } from "./password-input";
import { NoWrap } from "./ui/nowrap";

export interface FieldEditPasswordProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditPassword: React.FC<FieldEditPasswordProps> = React.memo(({ label, value, onChange }) => {
  return (
    <>
      <NoWrap>{label}</NoWrap>
      <PasswordInput password={value} onChange={onChange} />
    </>
  )
});
