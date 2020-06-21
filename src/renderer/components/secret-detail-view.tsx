import * as React from "react";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { translations } from "../i18n";
import { NonIdealState, Spinner } from "@blueprintjs/core";
import { FieldText } from "./field-text";
import { PasswordStrength } from "../../../native";
import { FieldNote } from "./field-note";
import { FieldPassword } from "./field-password";
import { SecretVersionSelect } from "./secret-versions-select";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { FieldTOTP } from "./field-totp";

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
      case "totpUrl":
        return (
          <FieldTOTP key={name} label={translate.secret.property(name)} otpUrl={value} otpToken={state.context.otpTokens && state.context.otpTokens[name]} onCopy={onCopyProperty(name)} />
        );
      default:
        return (
          <FieldText key={name} label={translate.secret.property(name)} value={value} onCopy={onCopyProperty(name)} />
        );
    }
  }

  if (state.matches("unlocked.fetch_secret") ||
    state.matches("unlocked.fetch_secret_version")) {
    return (
      <Grid height={[100, '%']}>
        <GridItem alignSelf="center" justifySelf="center">
          <Spinner />
        </GridItem>
      </Grid>
    )
  } else if (!state.matches("unlocked.display_secret")) {
    return (
      <NonIdealState
        title={translate.secret.noSecretTitle}
        description={translate.secret.noSecretDescription} />
    )
  }

  return (
    <div style={{ overflowY: "auto" }}>
      <Grid columnSpec="min-content 1fr" gap={5}>
        <GridItem colSpan={2} justifySelf="center">
          <SecretVersionSelect />
        </GridItem>
        <FieldText label={translate.secret.name} value={state.context.currentSecretVersion.name} />
        <FieldText label={translate.secret.type} value={state.context.currentSecretVersion.type} />
        {Object.keys(state.context.currentSecretVersion.properties).map(name =>
          renderProperty(name, state.context.currentSecretVersion.properties[name], state.context.currentSecret.password_strengths[name])
        )}
      </Grid>
    </div>
  )
}