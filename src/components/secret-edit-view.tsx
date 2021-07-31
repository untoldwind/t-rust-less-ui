import * as React from "react";
import { useActor } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { Spinner, Button } from "@blueprintjs/core";
import { translations } from "../i18n";
import { FieldEditText } from "./field-edit-text";
import { FieldEditType } from "./field-edit-type";
import { orderProperties } from "../helpers/types";
import { FieldEditNotes } from "./field-edit-notes";
import { FieldEditPassword } from "./field-edit-password";
import { FieldEditTags } from "./field-edit-tags";
import { FieldEditUrls } from "./field-edit-urls";
import { FieldEditRecipients } from "./field-edit-recipients";

export const SecretEditView: React.FC = () => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useActor(mainInterpreter);

  function renderProperty(name: string, value: string): React.ReactNode {
    const onChange = (value: string) => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { properties: { [name]: value } } });
    switch (name) {
      case "notes":
        return (
          <FieldEditNotes key={name} label={translate.secret.property(name)} value={value} onChange={onChange} />
        )
      case "password":
        return (
          <FieldEditPassword key={name} label={translate.secret.property(name)} value={value} onChange={onChange} />
        )
      default:
        return (
          <FieldEditText key={name} label={translate.secret.property(name)} value={value} onChange={onChange} />
        )
    }
  }

  if (!state.matches("unlocked.edit_secret_version.editable"))
    return (
      <Grid height={[100, '%']}>
        <GridItem alignSelf="center" justifySelf="center">
          <Spinner />
        </GridItem>
      </Grid>
    )

  const isValid = state.context.editSecretVersion.name.length > 0 && state.context.editSecretVersion.recipients.length > 0;

  return (
    <Grid rowSpec="min-content 1fr" columns={1} padding={5}>
      <Grid justifyItems="center" alignItems="center" columnSpec="1fr min-content min-content" gap={5}>
        {translate.formatTimestamp(state.context.editSecretVersion.timestamp)}
        <Button icon="tick" large minimal disabled={!isValid} onClick={() => send({ type: "STORE_SECRET_VERSION" })} />
        <Button icon="cross" large minimal onClick={() => send({ type: "ABORT_EDIT" })} />
      </Grid>
      <GridItem overflow="auto">
        <Grid columnSpec="min-content 1fr" gap={5} padding={5} alignItems="center">
          <FieldEditText label={translate.secret.name} value={state.context.editSecretVersion.name}
            onChange={name => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { name } })} />
          <FieldEditType value={state.context.editSecretVersion.type}
            onChange={type => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { type } })} />
          <FieldEditTags allTags={state.context.secretList.all_tags} tags={state.context.editSecretVersion.tags}
            onChange={tags => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { tags } })} />
          <FieldEditUrls urls={state.context.editSecretVersion.urls}
            onChange={urls => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { urls } })} />
          <GridItem colSpan={2} padding={[5, 0]} />
          {orderProperties(state.context.editSecretVersion).map(({ name, value }) =>
            renderProperty(name, value)
          )}
          <GridItem colSpan={2} padding={[10, 0]} />
          <FieldEditRecipients identities={state.context.identities} recipients={state.context.editSecretVersion.recipients}
            onChange={recipients => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { recipients } })} />
        </Grid>
      </GridItem>
    </Grid>
  )
}