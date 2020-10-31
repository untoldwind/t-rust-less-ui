import * as React from "react";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { translations } from "../i18n";
import { NonIdealState, Spinner, Button, Tooltip, Tag } from "@blueprintjs/core";
import { FieldText } from "./field-text";
import { PasswordStrength } from "../../../native";
import { FieldNotes } from "./field-notes";
import { FieldPassword } from "./field-password";
import { SecretVersionSelect } from "./secret-versions-select";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { FieldTOTP } from "./field-totp";
import { SecretCreateMenu } from "./secret-create-menu";
import { FieldType } from "./field-type";
import { orderProperties } from "../helpers/types";
import { ConfirmAction } from "./confirm-action";
import { FieldTags } from "./field-tags";
import { FieldUrls } from "./field-urls";
import { FieldRecipients } from "./field-recipients";

export const SecretDetailView: React.FunctionComponent = () => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useService(mainInterpreter);

  function onCopyProperty(propertyName: string): () => void {
    return () => send({ type: "COPY_SECRET_PROPERTY", propertyName })
  }

  function renderProperty(name: string, value: string, strength?: PasswordStrength): React.ReactNode {
    switch (name) {
      case "notes":
        return (
          <FieldNotes key={name} label={translate.secret.property(name)} value={value} onCopy={onCopyProperty(name)} />
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
      <Grid justifyItems="center" alignItems="center" columnSpec="60px 1fr min-content min-content">
        {state.context.currentSecretVersion.deleted && <Tag>{translate.secret.archived}</Tag>}
        {!state.context.currentSecretVersion.deleted && <div />}
        <SecretVersionSelect />
        {!state.context.currentSecret.current.deleted && <ConfirmAction icon="archive" action={translate.action.archiveSecret} onConfirm={() => send({ type: "ARCHIVE_SECRET" })} />}
        {state.context.currentSecret.current.deleted && <ConfirmAction icon="unarchive" action={translate.action.unarchiveSecret} onConfirm={() => send({ type: "UNARCHIVE_SECRET" })} />}
        {!state.context.currentSecret.current.deleted && <Tooltip content={translate.action.editSecret}>
          <Button icon="edit" large minimal onClick={() => send({ type: "NEW_SECRET_VERSION" })} />
        </Tooltip>}
      </Grid>
      <GridItem overflow="auto">
        <Grid columnSpec="min-content 1fr" gap={5} padding={5}>
          <FieldText label={translate.secret.name} value={state.context.currentSecretVersion.name} />
          <FieldType value={state.context.currentSecretVersion.type} />
          <FieldTags tags={state.context.currentSecretVersion.tags} />
          <FieldUrls urls={state.context.currentSecretVersion.urls} />
          <GridItem colSpan={2} padding={[5, 0]} />
          {orderProperties(state.context.currentSecretVersion).map(({ name, value }) =>
            renderProperty(name, value, state.context.currentSecret.password_strengths[name])
          )}
          <GridItem colSpan={2} padding={[10, 0]} />
          <FieldRecipients identities={state.context.identities} recipients={state.context.currentSecretVersion.recipients} />
        </Grid>
      </GridItem>
      <SecretCreateMenu />
    </Grid>
  )
}