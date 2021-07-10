import { Button, InputGroup, Popover } from "@blueprintjs/core";
import * as React from "react";
import { estimatePassword, PasswordStrength } from "../machines/backend-tauri";
import { PasswordGenerator } from "./password-generator";
import { PasswordStrengthView } from "./password-strength-view";
import { Flex } from "./ui/flex";
import { Grid } from "./ui/grid";

export interface PasswordInputProps {
  password: string
  onChange: (password: string) => void
}

export const PasswordInput: React.FunctionComponent<PasswordInputProps> = ({ password, onChange }) => {
  const [timer, setTimer] = React.useState<number | null>(null);
  const [reveal, setReveal] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState<PasswordStrength | undefined>(undefined);

  React.useEffect(debounce(500, () => {
    if (password.length === 0)
      setPasswordStrength(undefined);
    else
      estimatePassword(password).then(setPasswordStrength, () => setPasswordStrength(undefined));
  }), [password]);

  function debounce(delay: number, fn: () => void): () => void {
    return () => {
      if (!timer)
        setTimer(window.setTimeout(() => {
          fn();
          setTimer(null);
        }, delay));
    };
  }

  return (
    <Grid columns={1}>
      <InputGroup value={password} fill
        type={reveal ? "text" : "password"}
        onChange={(event: React.FormEvent<HTMLInputElement>) => onChange(event.currentTarget.value)}
        rightElement={<Flex flexDirection="row" gap={5}>
          <Button minimal icon={reveal ? "eye-on" : "eye-off"} onClick={() => setReveal(!reveal)} />
          <Popover fill position="bottom-right" content={<PasswordGenerator onPasswordGenerated={onChange} />}>
            <Button minimal icon="cog" />
          </Popover>
        </Flex>}
      />
      <PasswordStrengthView passwordStrength={passwordStrength} />
    </Grid>
  )
}