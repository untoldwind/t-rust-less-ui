import React from "react";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { SecretEntryList } from "./secret-entry-list";
import { SecretDetailView } from "./secret-detail-view";
import { ListSecretsHeader } from "./list-secrets-header";
import { ListSecretsSidebar } from "./list-secrets-sidebar";
import { Toaster, Toast } from "@blueprintjs/core";
import { SecretEditView } from "./secret-edit-view";
import { useRecoilState, useRecoilValue } from "recoil";
import { editSecretVersionState, errorState } from "../machines/state";
import { Loading } from "./loading";

export interface ListSecretsProps {
  onKeyDown: React.KeyboardEventHandler<HTMLElement>
  onKeyUp: React.KeyboardEventHandler<HTMLElement>
}

export const ListSecrets: React.FC<ListSecretsProps> = ({ onKeyUp, onKeyDown }) => {
  const [error, setError] = useRecoilState(errorState);
  const editSecretVersion = useRecoilValue(editSecretVersionState);

  return (
    <Grid
      height={[100, "vh"]}
      columnSpec="min-content minmax(min-content, 1fr) 3fr"
      rowSpec="min-content min-content 1fr">
      <GridItem colSpan={3}>
        <ListSecretsHeader />
      </GridItem>
      <GridItem colSpan={3}>
        <Toaster>
          {error && <Toast intent="danger" message={error} timeout={2000} onDismiss={() => setError(undefined)} />}
        </Toaster>
      </GridItem>
      <ListSecretsSidebar />
      <React.Suspense fallback={<Loading />}>
        <SecretEntryList />
      </React.Suspense>
      <React.Suspense fallback={<Loading />}>
        {!editSecretVersion && <SecretDetailView />}
        {editSecretVersion && <SecretEditView />}
      </React.Suspense>
    </Grid>
  )
};