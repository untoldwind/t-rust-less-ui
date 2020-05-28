import * as React from "react";
import { Hotkeys, HotkeysTarget, Hotkey } from "@blueprintjs/core";
import { ListSecrets } from "./list-secrets";
import { mainInterpreter } from "../machines/main";

@HotkeysTarget
export class ListSecretsHotkeys extends React.Component<{}, {}> {
  public render() {
    return (
      <ListSecrets />
    )
  }

  public renderHotkeys() {
    return (
      <Hotkeys>
        <Hotkey global combo="up" label="Previous entry" onKeyDown={() => mainInterpreter.send({ type: "SELECT_PREVIOUS" })} />
        <Hotkey global combo="down" label="Previous entry" onKeyDown={() => mainInterpreter.send({ type: "SELECT_NEXT" })} />
      </Hotkeys>
    )
  }
}
