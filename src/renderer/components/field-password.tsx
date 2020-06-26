import * as React from "react";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { Button, ProgressBar, Tooltip } from "@blueprintjs/core";
import { Grid } from "./ui/grid";
import { translations } from "../i18n";
import { PasswordStrength } from "../../../native";

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
  const translate = React.useMemo(translations, [translations]);
  const [reveal, setReveal] = React.useState(false);
  const { label, value, strength, onCopy } = props;

  function renderStrengthDetail(strength?: PasswordStrength): JSX.Element | undefined {
    if (!strength) return undefined;

    return (
      <Grid columns={2} gap={5}>
        <div>{translate.secret.strength.score}</div>
        <div>{strength.score}</div>
        <div>{translate.secret.strength.entropy}</div>
        <div>{strength.entropy.toFixed(1)}</div>
        <div>{translate.secret.strength.cracktime}</div>
        <div>{strength.crack_time_display}</div>
      </Grid>
    )
  }

  return (
    <>
      <div>{label}</div>
      <Flex flexDirection="row" gap={5}>
        <FlexItem flexGrow={1}>
          <Tooltip targetTagName="div" content={renderStrengthDetail(strength)}>
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
