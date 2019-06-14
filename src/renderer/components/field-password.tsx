import * as React from "react";
import { FlexHorizontal, FlexItem } from "./ui/flex";
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
      <FlexHorizontal gap="md">
        <FlexItem grow={0} basis={[10, '%']}>{label}</FlexItem>
        <FlexItem grow={1}>{reveal ? value : "*".repeat(value.length)}</FlexItem>
        <FlexItem grow={0}>
          <FlexHorizontal>
            <Button active={reveal} minimal onClick={() => { this.setState({ reveal: !reveal }) }} icon={reveal ? "eye-off" : "eye-on"} />
            <Button icon="clipboard" minimal />
          </FlexHorizontal>
        </FlexItem>
      </FlexHorizontal>
    )
  }
}