import * as React from "react";
import { TextArea } from "@blueprintjs/core";
import { NoWrap } from "./ui/nowrap";

export interface FieldEditNotesProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditNotes: React.FunctionComponent<FieldEditNotesProps> = ({ label, value, onChange }) => {
  return (
    <>
      <NoWrap>{label}</NoWrap>
      <TextArea growVertically fill value={value}
        onChange={event => onChange(event.currentTarget.value)} />
    </>
  )
}