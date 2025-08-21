import React, { useContext } from "react";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { SecretEntryList } from "./secret-entry-list";
import { SecretDetailView } from "./secret-detail-view";
import { ListSecretsHeader } from "./list-secrets-header";
import { ListSecretsSidebar } from "./list-secrets-sidebar";
import { SecretEditView } from "./secret-edit-view";
import { BrowseStateContext } from "../contexts/browse-state";

export interface ListSecretsProps {
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  onKeyUp: React.KeyboardEventHandler<HTMLElement>;
}

export const ListSecrets: React.FC<ListSecretsProps> = ({
  onKeyUp,
  onKeyDown,
}) => {
  const browseState = useContext(BrowseStateContext);

  return (
    <Grid
      height={[100, "vh"]}
      columnSpec="min-content minmax(min-content, 1fr) 3fr"
      rowSpec="min-content 1fr"
    >
      <GridItem colSpan={3}>
        <ListSecretsHeader />
      </GridItem>
      <ListSecretsSidebar />
      <SecretEntryList />
      {!browseState.editSecretVersion && <SecretDetailView />}
      {browseState.editSecretVersion && (
        <SecretEditView secretVersion={browseState.editSecretVersion} />
      )}
    </Grid>
  );
};
