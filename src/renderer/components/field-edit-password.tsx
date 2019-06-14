import * as React from "react";
import { FlexHorizontal, FlexItem } from "./ui/flex";
import { InputGroup, Button } from "@blueprintjs/core";

export interface FieldEditPasswordProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export interface FieldEditPasswordState {
  reveal: boolean
}

export class FieldEditPassword extends React.Component<FieldEditPasswordProps, FieldEditPasswordState> {
  constructor(props: FieldEditPasswordProps) {
    super(props);

    this.state = {
      reveal: false,
    };
  }

  render(): React.ReactNode {
    const { label, value, onChange } = this.props;
    const { reveal } = this.state;

    return (
      <FlexHorizontal gap="md">
        <FlexItem grow={0} basis={[10, '%']}>{label}</FlexItem>
        <FlexItem grow={1}>
          <InputGroup value={value} type={reveal ? "text" : "password"} onChange={(event: React.FormEvent<HTMLElement>) => onChange((event.target as HTMLInputElement).value)} />
        </FlexItem>
        <FlexItem grow={0}>
          <FlexHorizontal>
            <Button active={reveal} onClick={() => { this.setState({ reveal: !reveal }) }} icon={reveal ? "eye-off" : "eye-open"} />
          </FlexHorizontal>
        </FlexItem>
      </FlexHorizontal>
    )
  }
}
