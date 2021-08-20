import React from "react";
import { NonIdealState, Button, Tag } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { FieldText } from "./field-text";
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
import { PasswordStrength } from "../machines/backend-tauri";
import { identitiesState, selectedSecretState, selectedSecretVersionState, useTranslate } from "../machines/state";
import { useRecoilValue } from "recoil";
import { useAddSecretVersion, useCopySecretProperties, useToggleArchiveSecret } from "../machines/actions";

export const SecretDetailView: React.FC = () => {
  const translate = useTranslate();
  const currentSecret = useRecoilValue(selectedSecretState);
  const currentSecretVersion = useRecoilValue(selectedSecretVersionState);
  const identities = useRecoilValue(identitiesState);
  const addSecretVersion = useAddSecretVersion();
  const toggleArchiveSecret = useToggleArchiveSecret();
  const copySecretProperties = useCopySecretProperties();

  function renderProperty(name: string, value: string, strength?: PasswordStrength): React.ReactNode {
    switch (name) {
      case "notes":
        return (
          <FieldNotes key={name} label={translate.secret.property(name)} value={value} onCopy={() => copySecretProperties([name])} />
        );
      case "password":
        return (
          <FieldPassword key={name} label={translate.secret.property(name)} value={value} strength={strength} onCopy={() => copySecretProperties([name])} />
        );
      case "totpUrl":
        return (
          <FieldTOTP key={name} label={translate.secret.property(name)} otpUrl={value} onCopy={() => copySecretProperties([name])} />
        );
      default:
        return (
          <FieldText key={name} label={translate.secret.property(name)} value={value} onCopy={() => copySecretProperties([name])} />
        );
    }
  }

  if (!currentSecret || !currentSecretVersion) {
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
        {currentSecretVersion.deleted && <Tag>{translate.secret.archived}</Tag>}
        {!currentSecretVersion.deleted && <div />}
        <SecretVersionSelect />
        {!currentSecret.current.deleted && <ConfirmAction icon="archive" action={translate.action.archiveSecret} onConfirm={toggleArchiveSecret} />}
        {currentSecret.current.deleted && <ConfirmAction icon="unarchive" action={translate.action.unarchiveSecret} onConfirm={toggleArchiveSecret} />}
        {!currentSecret.current.deleted && <Tooltip2 content={translate.action.editSecret}>
          <Button icon="edit" large minimal onClick={addSecretVersion} />
        </Tooltip2>}
      </Grid>
      <GridItem>
        <Grid columnSpec="min-content minmax(0, 1fr)" gap={5} padding={5}>
          <FieldText label={translate.secret.name} value={currentSecretVersion.name} />
          <FieldType value={currentSecretVersion.type} />
          <FieldTags tags={currentSecretVersion.tags} />
          <FieldUrls urls={currentSecretVersion.urls} />
          <GridItem colSpan={2} padding={[5, 0]} />
          {orderProperties(currentSecretVersion).map(({ name, value }) =>
            renderProperty(name, value, currentSecret.password_strengths[name])
          )}
          <GridItem colSpan={2} padding={[10, 0]} />
          <FieldRecipients identities={identities} recipients={currentSecretVersion.recipients} />
        </Grid>
      </GridItem>
      <GridItem justifySelf="start">
        <SecretCreateMenu />
      </GridItem>
    </Grid>
  )
}