import * as React from "react";
import { PasswordStrength } from "../../../native";
import { Grid } from "./ui/grid";
import { translations } from "../i18n";

export interface PasswordStrengthDetailsProps {
  strength?: PasswordStrength
}

export const PasswordStrengthDetails: React.FunctionComponent<PasswordStrengthDetailsProps> = props => {
  const translate = React.useMemo(translations, [translations]);
  const { strength } = props;

  if (!strength) return null;

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