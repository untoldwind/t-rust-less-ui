import React from "react";
import { TextArea } from "@blueprintjs/core";
import { NoWrap } from "./ui/nowrap";

export interface FieldEditNotesProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditNotes: React.FC<FieldEditNotesProps> = React.memo(({ label, value, onChange }) => {
  return (
    <>
      <NoWrap>{label}</NoWrap>
      <TextArea autoResize fill value={value}
        onChange={event => onChange(event.currentTarget.value)} />
    </>
  )
});
