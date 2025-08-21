import React, { useContext, useState } from "react";
import { NonIdealState, Button, Tag, Tooltip } from "@blueprintjs/core";
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
import { PasswordStrength } from "../contexts/backend-tauri";
import { TranslationsContext } from "../i18n";
import { MainStateContext } from "../contexts/main-state";
import { BrowseStateContext } from "../contexts/browse-state";
import { ZoomDisplay } from "./zoom-display";
import { Loading } from "./loading";
import moment from "moment";

export const SecretDetailView: React.FC = () => {
  const mainState = useContext(MainStateContext);
  const browseState = useContext(BrowseStateContext);
  const translate = useContext(TranslationsContext);
  const [zoomSecretProperty, setZoomSecretProperty] = useState<string | null>(
    null,
  );

  function addSecretVersion() {
    if (!browseState.selectedSecretVersion) return;

    browseState.setEditSecretVersion({
      ...browseState.selectedSecretVersion,
      timestamp: moment().format(),
    });
  }

  function toggleArchiveSecret() {
    if (!browseState.selectedSecretVersion) return;

    browseState.createSecretVersion({
      ...browseState.selectedSecretVersion,
      timestamp: moment().format(),
      deleted: !browseState.selectedSecretVersion.deleted,
    });
  }

  function renderProperty(
    name: string,
    value: string,
    strength?: PasswordStrength,
  ): React.ReactNode {
    switch (name) {
      case "notes":
        return (
          <FieldNotes
            key={name}
            label={translate.secret.property(name)}
            value={value}
            onCopy={() => browseState.copySecretProperties([name])}
          />
        );
      case "password":
        return (
          <FieldPassword
            key={name}
            label={translate.secret.property(name)}
            value={value}
            strength={strength}
            onZoom={() => setZoomSecretProperty(name)}
            onCopy={() => browseState.copySecretProperties([name])}
          />
        );
      case "totpUrl":
        return (
          <FieldTOTP
            key={name}
            label={translate.secret.property(name)}
            otpUrl={value}
            onCopy={() => browseState.copySecretProperties([name])}
          />
        );
      default:
        return (
          <FieldText
            key={name}
            label={translate.secret.property(name)}
            value={value}
            onZoom={() => setZoomSecretProperty(name)}
            onCopy={() => browseState.copySecretProperties([name])}
          />
        );
    }
  }

  if (!browseState.selectedSecret || !browseState.selectedSecretVersion) {
    return (
      <NonIdealState
        title={translate.secret.noSecretTitle}
        description={translate.secret.noSecretDescription}
        action={<SecretCreateMenu />}
      />
    );
  } else if (browseState.detailsBusy) {
    return <Loading />;
  }

  return (
    <>
      <Grid rowSpec="min-content 1fr min-content" columns={1} padding={5}>
        <Grid
          justifyItems="center"
          alignItems="center"
          columnSpec="60px 1fr min-content min-content"
        >
          {browseState.selectedSecretVersion.deleted && (
            <Tag>{translate.secret.archived}</Tag>
          )}
          {!browseState.selectedSecretVersion.deleted && <div />}
          <SecretVersionSelect secret={browseState.selectedSecret} />
          {!browseState.selectedSecret.current.deleted && (
            <ConfirmAction
              icon="archive"
              action={translate.action.archiveSecret}
              onConfirm={toggleArchiveSecret}
            />
          )}
          {browseState.selectedSecret.current.deleted && (
            <ConfirmAction
              icon="unarchive"
              action={translate.action.unarchiveSecret}
              onConfirm={toggleArchiveSecret}
            />
          )}
          {!browseState.selectedSecret.current.deleted && (
            <Tooltip content={translate.action.editSecret}>
              <Button icon="edit" large minimal onClick={addSecretVersion} />
            </Tooltip>
          )}
        </Grid>
        <GridItem>
          <Grid columnSpec="min-content minmax(0, 1fr)" gap={5} padding={5}>
            <FieldText
              label={translate.secret.name}
              value={browseState.selectedSecretVersion.name}
            />
            <FieldType value={browseState.selectedSecretVersion.type} />
            <FieldTags tags={browseState.selectedSecretVersion.tags} />
            <FieldUrls urls={browseState.selectedSecretVersion.urls} />
            <GridItem colSpan={2} padding={[5, 0]} />
            {orderProperties(browseState.selectedSecretVersion).map(
              ({ name, value }) =>
                renderProperty(
                  name,
                  value,
                  browseState.selectedSecret?.password_strengths[name],
                ),
            )}
            <GridItem colSpan={2} padding={[10, 0]} />
            <FieldRecipients
              identities={mainState.identities}
              recipients={browseState.selectedSecretVersion.recipients}
            />
          </Grid>
        </GridItem>
        <GridItem justifySelf="start">
          <SecretCreateMenu />
        </GridItem>
      </Grid>
      {zoomSecretProperty && (
        <ZoomDisplay
          secretVersion={browseState.selectedSecretVersion}
          property={zoomSecretProperty}
          onClose={() => setZoomSecretProperty(null)}
        />
      )}
    </>
  );
};
