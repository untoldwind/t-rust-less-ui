import * as React from "react";
import { UnlockStore } from "./unlock-store";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { ListSecretsHotkeys } from "./list-secrets-hotkeys";

export const MainFrame: React.FunctionComponent<{}> = props => {
  const [state] = useService(mainInterpreter);

  switch (true) {
    case state.matches("locked"):
      return (
        <UnlockStore />
      );
    case state.matches("unlocked"):
      return (
        <ListSecretsHotkeys />
      );
    default:
      return null;
  }
}
