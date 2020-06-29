import * as React from "react";
import { TextArea } from "@blueprintjs/core";

export interface FieldEditNotesProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditNotes: React.FunctionComponent<FieldEditNotesProps> = props => {
  const { label, value, onChange } = props;

  return (
    <>
      <div>{label}</div>
      <TextArea growVertically fill value={value}
        onChange={event => onChange(event.currentTarget.value)} />
    </>
  )
}