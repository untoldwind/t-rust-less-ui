import * as React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Button } from "@blueprintjs/core";
import { Grid } from "./ui/grid";
import { PasswordStrength } from "../../../native";
import { PasswordStrengthView } from "./password-strength-view";

export interface FieldPasswordProps {
  label: string
  value: string
  strength?: PasswordStrength
  onCopy: () => void
}

export interface FieldPasswordState {
  reveal: boolean
}

export const FieldPassword: React.FunctionComponent<FieldPasswordProps> = ({ label, value, strength, onCopy }) => {
  const [reveal, setReveal] = React.useState(false);

  return (
    <>
      <div>{label}</div>
      <Flex flexDirection="row" gap={5}>
        <FlexItem flexGrow={1}>
          <Grid columns={1}>
            <div>{reveal ? value : "*".repeat(value.length)}</div>
            <PasswordStrengthView passwordStrength={strength} />
          </Grid>
        </FlexItem>
        <FlexItem flexGrow={0}>
          <Flex flexDirection="row">
            <Button active={reveal} minimal onClick={() => setReveal(!reveal)} icon={reveal ? "eye-off" : "eye-open"} />
            <Button icon="clipboard" minimal onClick={onCopy} />
          </Flex>
        </FlexItem>
      </Flex>
    </>
  )
}
