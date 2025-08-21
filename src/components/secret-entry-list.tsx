import React, { useContext } from "react";
import { Menu, MenuItem } from "@blueprintjs/core";
import { SecretEntryMatch } from "../contexts/backend-tauri";
import { css } from "@emotion/css";
import { BrowseStateContext } from "../contexts/browse-state";
import { Loading } from "./loading";

export const secretListContainer = css({
  overflowY: "auto",
  borderRight: "1px solid black",
});

export const SecretEntryList: React.FC = () => {
  const browseState = useContext(BrowseStateContext);

  function highlight(name_highlights: number[], name: string) {
    const chunks: React.ReactNode[] = [];
    let last = 0;

    for (const highlight of name_highlights) {
      if (highlight > last)
        chunks.push(
          <span key={chunks.length}>{name.substring(last, highlight)}</span>,
        );
      chunks.push(<b key={chunks.length}>{name[highlight]}</b>);
      last = highlight + 1;
    }
    if (last < name.length)
      chunks.push(<span key={chunks.length}>{name.substring(last)}</span>);

    return chunks;
  }

  function renderListEntry(entryMatch: SecretEntryMatch): React.ReactNode {
    return (
      <MenuItem
        key={entryMatch.entry.id}
        text={highlight(entryMatch.name_highlights, entryMatch.entry.name)}
        active={entryMatch.entry.id === browseState.selectedSecret?.id}
        onClick={() => browseState.setSelectedSecretId(entryMatch.entry.id)}
      />
    );
  }

  return (
    <div className={secretListContainer}>
      {browseState.listBusy && <Loading />}
      {!browseState.listBusy && (
        <Menu>{browseState.secretList.entries.map(renderListEntry)}</Menu>
      )}
    </div>
  );
};
