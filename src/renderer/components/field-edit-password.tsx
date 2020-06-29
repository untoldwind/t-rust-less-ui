import * as React from "react";
import { Flex } from "./ui/flex";
import { InputGroup, Popover, Button } from "@blueprintjs/core";
import { FlexItem } from "./ui/flex-item";

export interface FieldEditPasswordProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

export const FieldEditPassword: React.FunctionComponent<FieldEditPasswordProps> = props => {
  const { label, value, onChange } = props;
  const [generatorOpened, setGeneratorOpened] = React.useState(false);

  return (
    <>
      <div>{label}</div>
      <Popover fill isOpen={generatorOpened}>
        <Flex flexDirection="row" gap={5}>
          <FlexItem flexGrow={1}>
            <InputGroup value={value} fill
              onChange={(event: React.FormEvent<HTMLInputElement>) => onChange(event.currentTarget.value)} />
          </FlexItem>
          <FlexItem flexGrow={0}>
            <Button active={generatorOpened} minimal onClick={() => setGeneratorOpened(!generatorOpened)} icon="cog" />
          </FlexItem>
        </Flex>
      </Popover>
    </>
  )
};

