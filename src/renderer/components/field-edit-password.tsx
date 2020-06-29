import * as React from "react";
import { Flex } from "./ui/flex";
import { InputGroup, Popover, Button, Tooltip, ProgressBar } from "@blueprintjs/core";
import { FlexItem } from "./ui/flex-item";
import { PasswordStrength } from "../../../native";
import { estimatePassword } from "../machines/backend-neon";
import { PasswordStrengthDetails } from "./password-strength-details";
import { Grid } from "./ui/grid";

export interface FieldEditPasswordProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditPassword: React.FunctionComponent<FieldEditPasswordProps> = props => {
  const { label, value, onChange } = props;
  const [generatorOpened, setGeneratorOpened] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState<PasswordStrength | undefined>(undefined);

  React.useEffect(() => {
    if (value.length === 0)
      setPasswordStrength(undefined);
    else
      estimatePassword(value).then(setPasswordStrength, () => setPasswordStrength(undefined));
  }, [value]);

  return (
    <>
      <div>{label}</div>
      <Popover fill isOpen={generatorOpened}>
        <Flex flexDirection="row" gap={5}>
          <FlexItem flexGrow={1}>
            <Tooltip targetTagName="div" content={<PasswordStrengthDetails strength={passwordStrength} />}>
              <Grid columns={1}>
                <InputGroup value={value} fill
                  onChange={(event: React.FormEvent<HTMLInputElement>) => onChange(event.currentTarget.value)} />
                {passwordStrength && <ProgressBar stripes={false} animate={false} value={passwordStrength.entropy / 55.0} />}
              </Grid>
            </Tooltip>

          </FlexItem>
          <FlexItem flexGrow={0}>
            <Button active={generatorOpened} minimal onClick={() => setGeneratorOpened(!generatorOpened)} icon="cog" />
          </FlexItem>
        </Flex>
      </Popover>
    </>
  )
};

