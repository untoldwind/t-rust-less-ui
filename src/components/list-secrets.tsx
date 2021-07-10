import * as React from "react";
import { Grid } from "./ui/grid";
import { GridItem } from "./ui/grid-item";
import { SecretEntryList } from "./secret-entry-list";
import { SecretDetailView } from "./secret-detail-view";
import { ListSecretsHeader } from "./list-secrets-header";
import { ListSecretsSidebar } from "./list-secrets-sidebar";
import { Toaster, Toast } from "@blueprintjs/core";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { SecretEditView } from "./secret-edit-view";

export const ListSecrets: React.FunctionComponent = () => {
  const [state, send] = useService(mainInterpreter);

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
          {state.matches("unlocked.error") &&
            <Toast
              intent="danger"
              message={state.context.errorMessage}
              timeout={2000}
              onDismiss={() => send({ type: "CONFIRM_ERROR" })} />
          }
        </Toaster>
      </GridItem>
      <ListSecretsSidebar />
      <SecretEntryList />
      {!state.matches("unlocked.edit_secret_version") && <SecretDetailView />}
      {state.matches("unlocked.edit_secret_version") && <SecretEditView />}
    </Grid>
  )
};