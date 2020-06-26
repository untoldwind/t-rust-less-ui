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

export const FieldTOTP: React.FunctionComponent<FieldTOPTProps> = props => {
  const [reveal, setReveal] = React.useState(false);
  const { otpToken, otpUrl, label, onCopy } = props;

  if (typeof otpToken === "object") {
    const { otpUrl } = props;
    const otp = new URLSearchParams(new URL(otpUrl).search);
    const popoverContent = (
      <Grid columns={1} padding={15} justifyItems="center">
        <QRCode value={otpUrl} size={256} level="Q" />
        <div>{otp.get("issuer")}</div>
        <div>{otp.get("secret")}</div>
      </Grid>
    );

    return (
      <>
        <div>{label}</div>
        <Popover fill
          content={popoverContent}
          isOpen={reveal}
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
                <Button active={reveal} minimal onClick={() => setReveal(!reveal)} icon={reveal ? "eye-off" : "eye-open"} />
                <Button icon="clipboard" minimal onClick={onCopy} />
              </Flex>
            </FlexItem>
          </Flex>
        </Popover>
      </>
    )
  }
  return (
    <>
      <div>{label}</div>
      <Flex flexDirection="row" gap={5}>
        <FlexItem flexGrow={1}>{otpUrl}</FlexItem>
      </Flex>
    </>
  );
}