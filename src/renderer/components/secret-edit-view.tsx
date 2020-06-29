import * as React from "react";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { Spinner } from "@blueprintjs/core";
import { translations } from "../i18n";
import { FieldEditText } from "./field-edit-text";
import { FieldEditType } from "./field-edit-type";

export const SecretEditView: React.FunctionComponent<{}> = props => {
  const translate = React.useMemo(translations, [translations]);
  const [state, send] = useService(mainInterpreter);

  function renderProperty(name: string, value: string): React.ReactNode {
    switch (name) {
      default:
        return (
          <FieldEditText key={name} label={translate.secret.property(name)} value={value}
            onChange={value => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { properties: { [name]: value } } })} />
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
  return (
    <Grid rowSpec="min-content 1fr" columns={1} padding={5}>
      <GridItem justifySelf="center">
        {translate.formatTimestamp(state.context.editSecretVersion.timestamp)}
      </GridItem>
      <GridItem overflow="auto">
        <Grid columnSpec="min-content 1fr" gap={5} padding={5} alignItems="center">
          <FieldEditText label={translate.secret.name} value={state.context.editSecretVersion.name}
            onChange={name => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { name } })} />
          <FieldEditType value={state.context.editSecretVersion.type}
            onChange={type => send({ type: "CHANGE_EDIT_SECRET_VERSION", change: { type } })} />
          {Object.keys(state.context.editSecretVersion.properties).map(name =>
            renderProperty(name, state.context.editSecretVersion.properties[name])
          )}
        </Grid>
      </GridItem>
    </Grid>
  )
}