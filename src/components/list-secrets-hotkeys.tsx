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
        <Hotkey global combo="ctrl + u" label="Copy username" onKeyDown={() => mainInterpreter.send({ type: "COPY_SECRET_PROPERTY", propertyName: "username" })} />
        <Hotkey global combo="ctrl + p" label="Copy password" onKeyDown={() => mainInterpreter.send({ type: "COPY_SECRET_PROPERTY", propertyName: "password" })} />
        <Hotkey global combo="ctrl + o" label="Copy OTP" onKeyDown={() => mainInterpreter.send({ type: "COPY_SECRET_PROPERTY", propertyName: "toptUrl" })} />
      </Hotkeys>
    )
  }
}
