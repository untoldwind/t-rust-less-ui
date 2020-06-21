import * as React from "react";
import { OTPToken } from "../../../native";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Grid } from "./ui/grid";
import { ProgressBar, Button } from "@blueprintjs/core";

export interface FieldTOPTProps {
  label: string
  otpUrl: string
  otpToken?: OTPToken
  onCopy: () => void
}

export interface FieldTOTPState {
  reveal: boolean
}

export class FieldTOTP extends React.Component<FieldTOPTProps, FieldTOTPState> {
  constructor(props: FieldTOPTProps) {
    super(props);

    this.state = {
      reveal: false,
    };
  }

  render() {
    const { otpToken, otpUrl, label, onCopy } = this.props;
    const { reveal } = this.state;

    if (typeof otpToken === "object")
      return (
        <>
          <div>{label}</div>
          <Flex flexDirection="row" gap={5}>
            <FlexItem flexGrow={1}>
              <Grid columns={1}>
                <div>{otpToken.totp.token}</div>
                <ProgressBar stripes={false} animate={false} value={otpToken.totp.valid_for / otpToken.totp.period} />
              </Grid>
            </FlexItem>
            <FlexItem flexGrow={0}>
              <Flex flexDirection="row">
                <Button active={reveal} minimal onClick={() => { this.setState({ reveal: !reveal }) }} icon={reveal ? "eye-off" : "eye-open"} />
                <Button icon="clipboard" minimal onClick={onCopy} />
              </Flex>
            </FlexItem>
          </Flex>
        </>
      )
    return (
      <>
        <div>{label}</div>
        <Flex flexDirection="row" gap={5}>
          <FlexItem flexGrow={1}>{otpUrl}</FlexItem>
        </Flex>
      </>
    );
  }
};