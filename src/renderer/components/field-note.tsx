import * as React from "react";
import { Grid } from "./ui/grid";

export interface FieldNoteProps {
  label: string
  value: string
}

export const FieldNote: React.FunctionComponent<FieldNoteProps> = props => {
  return (
    <Grid columns={2}>
      <div>{props.label}</div>
      <div>{props.value}</div>
    </Grid>
  )
}