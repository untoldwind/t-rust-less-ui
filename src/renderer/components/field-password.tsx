import * as React from "react";
import { FlexHorizontal } from "./ui/flex";
import { Button } from "@blueprintjs/core";

export interface FieldPasswordProps {
  label: string
  value: string
}

export interface FieldPasswordState {
  reveal: boolean
}

export class FieldPassword extends React.Component<FieldPasswordProps, FieldPasswordState> {
  constructor(props: FieldPasswordProps) {
    super(props);

    this.state = {
      reveal: false,
    };
  }

  render(): React.ReactNode {
    const { label, value } = this.props;
    const { reveal } = this.state;

    return (
      <FlexHorizontal>
        <div>{label}</div>
        <div>{reveal ? value : "*".repeat(value.length)}</div>
        <Button active={reveal} minimal onClick={() => { this.setState({ reveal: !reveal }) }} icon={reveal ? "eye-off" : "eye-on"} />
        <Button icon="clipboard" minimal />
      </FlexHorizontal>
    )
  }
}