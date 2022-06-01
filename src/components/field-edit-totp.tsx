import { Button, InputGroup } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import React from "react";
import { Flex } from "./ui/flex";
import { Grid } from "./ui/grid";
import { NoWrap } from "./ui/nowrap";

export interface FieldEditTOTPProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

const FieldEditTOTPPopover: React.FC<{ value: string, onChange: (newValue: string) => void }> = React.memo(({ value, onChange }) => {
  const otpUrl = new URL(value.startsWith("otpauth://") ? value : "otpauth://totp");
  const otpParams = new URLSearchParams(otpUrl.search);
  const name = otpUrl.pathname.startsWith('/') ? otpUrl.pathname.substring(1) : otpUrl.pathname;

  function updateName(event: React.ChangeEvent<HTMLInputElement>) {
    otpUrl.pathname = "/" + event.currentTarget.value;
    otpUrl.search = otpParams.toString();

    onChange(otpUrl.toString());
  }

  function updateIssuer(event: React.ChangeEvent<HTMLInputElement>) {
    otpParams.set("issuer", event.currentTarget.value);
    otpUrl.search = otpParams.toString();

    onChange(otpUrl.toString());
  }

  function updateSecret(event: React.ChangeEvent<HTMLInputElement>) {
    otpParams.set("secret", event.currentTarget.value);
    otpUrl.search = otpParams.toString();

    onChange(otpUrl.toString());
  }

  return (
    <Grid columnSpec="min-content 1fr" gap={5} padding={5} alignItems="center">
      <NoWrap>Name</NoWrap>
      <InputGroup value={name} fill onChange={updateName} />
      <NoWrap>Issuer</NoWrap>
      <InputGroup value={otpParams.get("issuer") || ""} fill onChange={updateIssuer} />
      <NoWrap>Secret</NoWrap>
      <InputGroup value={otpParams.get("secret") || ""} fill onChange={updateSecret} />
    </Grid>
  )
});

export const FieldEditTOTP: React.FC<FieldEditTOTPProps> = React.memo(({ label, value, onChange }) => {
  return (
    <>
      <NoWrap>{label}</NoWrap>
      <InputGroup value={value} fill
        onChange={event => onChange(event.currentTarget.value)}
        rightElement={<Flex flexDirection="row" gap={5} padding={[0, 5, 0, 0]}>
          <Popover2 fill usePortal position="bottom-right" content={<FieldEditTOTPPopover value={value} onChange={onChange} />}>
            <Button minimal icon="cog" />
          </Popover2>
        </Flex>}
      />
    </>
  )
});