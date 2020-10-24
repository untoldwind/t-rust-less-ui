import * as React from "react";
import { Menu, Spinner, MenuItem } from "@blueprintjs/core";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { Grid } from "./ui/grid";
import { SecretEntryMatch } from "../../../native";

export const SecretEntryList: React.FunctionComponent = () => {
  const [state, send] = useService(mainInterpreter);

  if (!state.matches("unlocked.select_secret") &&
    !state.matches("unlocked.fetch_secret") &&
    !state.matches("unlocked.fetch_secret_version") &&
    !state.matches("unlocked.display_secret") &&
    !state.matches("unlocked.edit_secret_version")) {
    return (
      <Grid columns={1}>
        <Spinner />
      </Grid>
    )
  }

  function renderListEntry(entryMatch: SecretEntryMatch): React.ReactNode {
    return (
      <MenuItem key={entryMatch.entry.id}
        text={entryMatch.entry.name}
        active={entryMatch.entry.id === state.context.selectedSecretId}
        onClick={() => send({ type: "SELECT_SECRET", selectedSecretId: entryMatch.entry.id })} />
    )
  }

  return (
    <div style={{ overflowY: "auto", borderRight: "1px solid black" }}>
      <Menu>
        {state.context.secretList.entries.map(renderListEntry)}
      </Menu>
    </div>
  )
}