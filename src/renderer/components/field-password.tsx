import * as React from "react";
import { Grid } from "./ui/grid";

export interface FieldPasswordProps {
  label: string
  value: string
}

export class FieldPassword extends React.Component<FieldPasswordProps, {}> {
  render(): React.ReactNode {
    const { label, value } = this.props;

    return (
      <Grid columns={2}>
        <div>{label}</div>
        <div>{"*".repeat(value.length)}</div>
      </Grid>

    )
  }
}