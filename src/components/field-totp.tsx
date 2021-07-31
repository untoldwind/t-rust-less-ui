import * as React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Grid } from "./ui/grid";
import { ProgressBar, Button, PopoverInteractionKind } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import QRCode from "qrcode.react";
import { NoWrap } from "./ui/nowrap";
import { OTPToken } from "../machines/backend-tauri";

export interface FieldTOPTProps {
  label: string
  otpUrl: string
  otpToken?: OTPToken
  onCopy: () => void
}

export const FieldTOTP: React.FC<FieldTOPTProps> = ({ otpToken, otpUrl, label, onCopy }) => {
  const [reveal, setReveal] = React.useState(false);

  if (typeof otpToken === "object" && otpUrl.startsWith("otpauth")) {
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
        <NoWrap>{label}</NoWrap>
        <Popover2 fill
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
        </Popover2>
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