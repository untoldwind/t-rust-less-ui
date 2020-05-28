import * as React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
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
      <Flex flexDirection="row" gap={5}>
        <FlexItem flexGrow={0} flexBasis={[10, '%']}>{label}</FlexItem>
        <FlexItem flexGrow={1}>
          <InputGroup value={value} type={reveal ? "text" : "password"} onChange={(event: React.FormEvent<HTMLElement>) => onChange((event.target as HTMLInputElement).value)} />
        </FlexItem>
        <FlexItem flexGrow={0}>
          <Flex flexDirection="row">
            <Button active={reveal} onClick={() => { this.setState({ reveal: !reveal }) }} icon={reveal ? "eye-off" : "eye-open"} />
          </Flex>
        </FlexItem>
      </Flex>
    )
  }
}
