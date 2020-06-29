import * as React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Button, ProgressBar, Tooltip } from "@blueprintjs/core";
import { Grid } from "./ui/grid";
import { PasswordStrength } from "../../../native";
import { PasswordStrengthDetails } from "./password-strength-details";

export interface FieldPasswordProps {
  label: string
  value: string
  strength?: PasswordStrength
  onCopy: () => void
}

export interface FieldPasswordState {
  reveal: boolean
}

export const FieldPassword: React.FunctionComponent<FieldPasswordProps> = props => {
  const [reveal, setReveal] = React.useState(false);
  const { label, value, strength, onCopy } = props;

  return (
    <>
      <div>{label}</div>
      <Flex flexDirection="row" gap={5}>
        <FlexItem flexGrow={1}>
          <Tooltip targetTagName="div" content={<PasswordStrengthDetails strength={strength} />}>
            <Grid columns={1}>
              <div>{reveal ? value : "*".repeat(value.length)}</div>
              {strength && <ProgressBar stripes={false} animate={false} value={strength.entropy / 55.0} />}
            </Grid>
          </Tooltip>
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
