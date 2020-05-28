import * as React from "react";
import { Flex } from "./ui/flex";
import { Button } from "@blueprintjs/core";

export const SecretVersionSelect: React.FunctionComponent<{}> = props => {
  return (
    <Flex flexDirection="row">
      <Button icon="chevron-backward" />
      <Button icon="chevron-forward" />
    </Flex>
  )
}