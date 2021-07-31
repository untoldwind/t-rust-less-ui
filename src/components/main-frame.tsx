import * as React from "react";
import { UnlockStore } from "./unlock-store";
import { useActor } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { ListSecretsHotkeys } from "./list-secrets-hotkeys";
import { Configuration } from "./configuration";

export const MainFrame: React.FunctionComponent = () => {
  const [state] = useActor(mainInterpreter);

  switch (true) {
    case state.matches("locked"):
      return (
        <UnlockStore />
      );
    case state.matches("unlocked"):
      return (
        <ListSecretsHotkeys />
      );
    case state.matches("config"):
      return (
        <Configuration />
      )
    default:
      return null;
  }
}
