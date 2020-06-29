import * as React from "react";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { translations } from "../i18n";
import { NonIdealState, Spinner, Button } from "@blueprintjs/core";
import { FieldText } from "./field-text";
import { PasswordStrength } from "../../../native";
import { FieldNote } from "./field-note";
import { FieldPassword } from "./field-password";
import { SecretVersionSelect } from "./secret-versions-select";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { FieldTOTP } from "./field-totp";
import { SecretCreateMenu } from "./secret-create-menu";
import { Flex } from "./ui/flex";

export const SecretDetailView: React.FunctionComponent<{}> = props => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useService(mainInterpreter);

  function onCopyProperty(propertyName: string): () => void {
    return () => send({ type: "COPY_SECRET_PROPERTY", propertyName })
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
        description={translate.secret.noSecretDescription}
        action={<SecretCreateMenu />}
      />
    )
  }

  return (
    <Grid rowSpec="min-content 1fr min-content" columns={1} padding={5}>
      <GridItem justifySelf="center">
        <Flex flexDirection="row" gap={10}>
          <SecretVersionSelect />
          <Button icon="edit" large minimal />
        </Flex>
      </GridItem>
      <GridItem overflow="auto">
        <Grid columnSpec="min-content 1fr" gap={5} padding={5} alignItems="center">
          <FieldText label={translate.secret.name} value={state.context.currentSecretVersion.name} />
          <FieldText label={translate.secret.type} value={state.context.currentSecretVersion.type} />
          {Object.keys(state.context.currentSecretVersion.properties).map(name =>
            renderProperty(name, state.context.currentSecretVersion.properties[name], state.context.currentSecret.password_strengths[name])
          )}
        </Grid>
      </GridItem>
      <SecretCreateMenu />
    </Grid>
  )
}