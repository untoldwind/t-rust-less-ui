import * as React from "react";
import { Menu, Spinner, MenuItem } from "@blueprintjs/core";
import { useActor } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { Grid } from "./ui/grid";
import { SecretEntryMatch } from "../machines/backend-tauri";

export const SecretEntryList: React.FunctionComponent = () => {
  const [state, send] = useActor(mainInterpreter);

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

  function highlight(name_highlights: number[], name: string) {
    const chunks: React.ReactNode[] = [];
    let last = 0;

    for (const highlight of name_highlights) {
      if (highlight > last) chunks.push(<span key={chunks.length}>{name.substring(last, highlight)}</span>);
      chunks.push(<b key={chunks.length}>{name[highlight]}</b>);
      last = highlight + 1;
    }
    if (last < name.length) chunks.push(<span key={chunks.length}>{name.substring(last)}</span>)

    return chunks;
  }

  function renderListEntry(entryMatch: SecretEntryMatch): React.ReactNode {
    return (
      <MenuItem key={entryMatch.entry.id}
        text={highlight(entryMatch.name_highlights, entryMatch.entry.name)}
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