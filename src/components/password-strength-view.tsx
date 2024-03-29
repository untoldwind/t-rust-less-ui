import * as React from "react";
import { Intent, ProgressBar } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { PasswordStrengthDetails } from "./password-strength-details";
import { PasswordStrength } from "../machines/backend-tauri";

export interface PasswordStrengthProps {
  passwordStrength?: PasswordStrength
}

export const PasswordStrengthView: React.FC<PasswordStrengthProps> = React.memo(({ passwordStrength }) => {
  let intent: Intent = "danger";

  if (passwordStrength && passwordStrength.score > 3) intent = "success";
  else if (passwordStrength && passwordStrength.score > 2) intent = "primary";
  else if (passwordStrength && passwordStrength.score > 1) intent = "warning";

  return (
    <Tooltip2 position="bottom" targetTagName="div" content={passwordStrength && <PasswordStrengthDetails strength={passwordStrength} />}>
      <ProgressBar intent={intent} stripes={false} animate={false} value={passwordStrength ? passwordStrength.entropy / 55.0 : 1.0} />
    </Tooltip2>
  )
});