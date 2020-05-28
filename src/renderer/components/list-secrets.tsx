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

export const ListSecrets: React.FunctionComponent<{}> = props => {
  const [state, send] = useService(mainInterpreter);

  return (
    <Grid
      height={[100, "vh"]}
      columnSpec={[[200, 'px'], [1, 'fr'], [2, 'fr']]}
      rowSpec="min-content min-content 1fr">
      <GridItem colSpan={3}>
        <ListSecretsHeader />
      </GridItem>
      <GridItem colSpan={3}>
        {state.matches("unlocked.error") && <Toaster>
          <Toast
            intent="danger"
            message={state.context.errorMessage}
            timeout={2000}
            onDismiss={() => send({ type: "CONFIRM_ERROR" })} />
        </Toaster>}
      </GridItem>
      <ListSecretsSidebar />
      <SecretEntryList />
      <SecretDetailView />
    </Grid>
  )
};