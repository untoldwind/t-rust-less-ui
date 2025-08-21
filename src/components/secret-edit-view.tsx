import React, { useContext, useState } from "react";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { Button } from "@blueprintjs/core";
import { FieldEditText } from "./field-edit-text";
import { FieldEditType } from "./field-edit-type";
import { orderProperties } from "../helpers/types";
import { FieldEditNotes } from "./field-edit-notes";
import { FieldEditPassword } from "./field-edit-password";
import { FieldEditTags } from "./field-edit-tags";
import { FieldEditUrls } from "./field-edit-urls";
import { FieldEditRecipients } from "./field-edit-recipients";
import { FieldEditTOTP } from "./field-edit-totp";
import { TranslationsContext } from "../i18n";
import { SecretVersion } from "../contexts/backend-tauri";
import { BrowseStateContext } from "../contexts/browse-state";
import { MainStateContext } from "../contexts/main-state";

export interface SecretEditViewProps {
  secretVersion: SecretVersion;
}

export const SecretEditView: React.FC<SecretEditViewProps> = ({
  secretVersion,
}) => {
  const mainState = useContext(MainStateContext);
  const browseState = useContext(BrowseStateContext);
  const translate = useContext(TranslationsContext);
  const [editSecretVersion, setEditSecretVersion] =
    useState<SecretVersion>(secretVersion);

  function renderProperty(name: string, value: string): React.ReactNode {
    const onChange = (value: string) =>
      setEditSecretVersion({
        ...editSecretVersion,
        properties: { ...editSecretVersion.properties, [name]: value },
      });
    switch (name) {
      case "notes":
        return (
          <FieldEditNotes
            key={name}
            label={translate.secret.property(name)}
            value={value}
            onChange={onChange}
          />
        );
      case "password":
        return (
          <FieldEditPassword
            key={name}
            label={translate.secret.property(name)}
            value={value}
            onChange={onChange}
          />
        );
      case "totpUrl":
        return (
          <FieldEditTOTP
            key={name}
            label={translate.secret.property(name)}
            value={value}
            onChange={onChange}
          />
        );
      default:
        return (
          <FieldEditText
            key={name}
            label={translate.secret.property(name)}
            value={value}
            onChange={onChange}
          />
        );
    }
  }

  const isValid =
    editSecretVersion.name.length > 0 &&
    editSecretVersion.recipients.length > 0;

  return (
    <Grid rowSpec="min-content 1fr" columns={1} padding={5}>
      <Grid
        justifyItems="center"
        alignItems="center"
        columnSpec="1fr min-content min-content"
        gap={5}
      >
        {translate.formatTimestamp(editSecretVersion.timestamp)}
        <Button
          icon="tick"
          large
          minimal
          disabled={!isValid}
          onClick={() => browseState.createSecretVersion(editSecretVersion)}
        />
        <Button
          icon="cross"
          large
          minimal
          onClick={() => browseState.setEditSecretVersion(undefined)}
        />
      </Grid>
      <GridItem overflow="auto">
        <Grid
          columnSpec="min-content 1fr"
          gap={5}
          padding={5}
          alignItems="center"
        >
          <FieldEditText
            label={translate.secret.name}
            value={editSecretVersion.name}
            onChange={(name) =>
              setEditSecretVersion({ ...editSecretVersion, name })
            }
          />
          <FieldEditType
            value={editSecretVersion.type}
            onChange={(type) =>
              setEditSecretVersion({ ...editSecretVersion, type })
            }
          />
          <FieldEditTags
            allTags={browseState.secretList.all_tags}
            tags={editSecretVersion.tags}
            onChange={(tags) =>
              setEditSecretVersion({ ...editSecretVersion, tags })
            }
          />
          <FieldEditUrls
            urls={editSecretVersion.urls}
            onChange={(urls) =>
              setEditSecretVersion({ ...editSecretVersion, urls })
            }
          />
          <GridItem colSpan={2} padding={[5, 0]} />
          {orderProperties(editSecretVersion).map(({ name, value }) =>
            renderProperty(name, value),
          )}
          <GridItem colSpan={2} padding={[10, 0]} />
          <FieldEditRecipients
            identities={mainState.identities}
            recipients={editSecretVersion.recipients}
            onChange={(recipients) =>
              setEditSecretVersion({ ...editSecretVersion, recipients })
            }
          />
        </Grid>
      </GridItem>
    </Grid>
  );
};
