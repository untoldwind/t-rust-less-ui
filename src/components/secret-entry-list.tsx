import React from "react";
import { Menu, MenuItem } from "@blueprintjs/core";
import { SecretEntryMatch } from "../machines/backend-tauri";
import { useRecoilState, useRecoilValue } from "recoil";
import { secretListState, selectedSecretIdState } from "../machines/state";
import { css } from "@emotion/css";

export const secretListContainer = css({
  overflowY: "auto",
  borderRight: "1px solid black",
});

export const SecretEntryList: React.FC = () => {
  const [selectedSecretId, setSelectedSecretId] = useRecoilState(selectedSecretIdState);
  const secretList = useRecoilValue(secretListState);

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
        active={entryMatch.entry.id === selectedSecretId}
        onClick={() => setSelectedSecretId(entryMatch.entry.id)} />
    )
  }

  return (
    <div className={secretListContainer}>
      <Menu>
        {secretList.entries.map(renderListEntry)}
      </Menu>
    </div>
  )
}