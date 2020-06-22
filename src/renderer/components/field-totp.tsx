import * as React from "react";
import { OTPToken } from "../../../native";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Grid } from "./ui/grid";
import { ProgressBar, Button, Popover, PopoverInteractionKind } from "@blueprintjs/core";
import QRCode from "qrcode.react";

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
          <Popover fill
            content={this.renderPopover()}
            interactionKind={PopoverInteractionKind.CLICK_TARGET_ONLY}>
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
          </Popover>
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

  private renderPopover() {
    const { otpUrl } = this.props;
    const otp = new URLSearchParams(new URL(otpUrl).search);

    return (
      <Grid columns={1} padding={15} justifyItems="center">
        <QRCode value={otpUrl} size={256} level="Q" />
        <div>{otp.get("issuer")}</div>
        <div>{otp.get("secret")}</div>
      </Grid>
    )
  }
}