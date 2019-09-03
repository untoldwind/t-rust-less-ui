import * as React from "react";
import { FlexHorizontal, FlexItem } from "./ui/flex";
import { Button, ProgressBar, Tooltip } from "@blueprintjs/core";
import { PasswordStrength } from "../../common/model";
import { Grid } from "./ui/grid";
import { translations } from "../i18n";

export interface FieldPasswordProps {
  label: string
  value: string
  strength?: PasswordStrength
  onCopy: () => void
}

export interface FieldPasswordState {
  reveal: boolean
}

export class FieldPassword extends React.Component<FieldPasswordProps, FieldPasswordState> {
  private translate = translations();

  constructor(props: FieldPasswordProps) {
    super(props);

    this.state = {
      reveal: false,
    };
  }

  render(): React.ReactNode {
    const { label, value, strength, onCopy } = this.props;
    const { reveal } = this.state;

    return (
      <FlexHorizontal gap="md">
        <FlexItem grow={0} basis={[10, '%']}>{label}</FlexItem>
        <FlexItem grow={1}>
          <Tooltip targetTagName="div" content={this.renderStrengthDetail(strength)}>
            <Grid columns={1}>
              <div>{reveal ? value : "*".repeat(value.length)}</div>
              {strength && <ProgressBar stripes={false} animate={false} value={strength.entropy / 55.0} />}
            </Grid>
          </Tooltip>
        </FlexItem>
        <FlexItem grow={0}>
          <FlexHorizontal>
            <Button active={reveal} minimal onClick={() => { this.setState({ reveal: !reveal }) }} icon={reveal ? "eye-off" : "eye-open"} />
            <Button icon="clipboard" minimal onClick={onCopy}/>
          </FlexHorizontal>
        </FlexItem>
      </FlexHorizontal>
    )
  }

  private renderStrengthDetail(strength?: PasswordStrength): JSX.Element | undefined {
    if (!strength) return undefined;

    return (
      <Grid columns={2} gap="base">
        <div>{this.translate.secret.strength.score}</div>
        <div>{strength.score}</div>
        <div>{this.translate.secret.strength.entropy}</div>
        <div>{strength.entropy.toFixed(1)}</div>
        <div>{this.translate.secret.strength.cracktime}</div>
        <div>{strength.crack_time_display}</div>
      </Grid>
    )
  }
}