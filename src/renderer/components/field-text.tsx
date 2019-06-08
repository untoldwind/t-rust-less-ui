import * as React from "react";
import { Grid } from "./ui/grid";

export interface FieldTextProps {
  label: string
  value: string
}

export const FieldText: React.FunctionComponent<FieldTextProps> = props => {
  return (
    <Grid columns={2}>
      <div>{props.label}</div>
      <div>{props.value}</div>
    </Grid>
  );
};