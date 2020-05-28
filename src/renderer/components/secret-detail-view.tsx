import * as React from "react";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { translations } from "../i18n";
import { NonIdealState } from "@blueprintjs/core";
import { Flex } from "./ui/flex";
import { FlexItem } from "./ui/flex-item";
import { FieldText } from "./field-text";
import { PasswordStrength } from "../../../native";
import { FieldNote } from "./field-note";
import { FieldPassword } from "./field-password";

export const SecretDetailView: React.FunctionComponent<{}> = props => {
  const translate = React.useMemo(translations, [translations]);
  const [state] = useService(mainInterpreter);

  function onCopyProperty(name: string): () => void {
    return () => { }
  }

  function renderProperty(name: string, value: string, strength?: PasswordStrength): React.ReactNode {
    switch (name) {
      case "note":
        return (
          <FieldNote key={name} label={translate.secret.property(name)} value={value} onCopy={onCopyProperty(name)} />
        );
      case "password":
        return (
          <FieldPassword key={name} label={translate.secret.property(name)} value={value} strength={strength} onCopy={onCopyProperty(name)} />
        );
      default:
        return (
          <FieldText key={name} label={translate.secret.property(name)} value={value} onCopy={onCopyProperty(name)} />
        );
    }
  }

  if (!state.matches("unlocked.display_secret")) {
    return (
      <NonIdealState
        title={translate.secret.noSecretTitle}
        description={translate.secret.noSecretDescription} />
    )
  }

  return (
    <div style={{ overflowY: "auto" }}>
      <Flex flexDirection="column" gap={5}>
        <FlexItem flexGrow={0}>
          <FieldText label={translate.secret.name} value={state.context.currentSecret.current.name} />
        </FlexItem>
        <FlexItem flexGrow={0}>
          <FieldText label={translate.secret.type} value={state.context.currentSecret.current.type} />
        </FlexItem>
        {Object.keys(state.context.currentSecret.current.properties).map(name => {
          const value = state.context.currentSecret.current.properties[name];
          const strength = state.context.currentSecret.password_strengths[name];
          return (
            <FlexItem flexGrow={0}>
              {renderProperty(name, value, strength)}
            </FlexItem>
          )
        })}
      </Flex>
    </div>
  )
}