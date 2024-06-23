import { List, ListItemButton, ListItemText } from "@mui/material";
import React, { useContext } from "react";
import { useBackend } from "../../backend/use-backend";
import { SecretEntryMatch, commands } from "../../backend/bindings";
import { BackendContext } from "../../backend/provider";

interface SecretListViewProps {
  matches: SecretEntryMatch[] | undefined;
}

const SecretListView: React.FC<SecretListViewProps> = React.memo(
  ({ matches }) => {
    return (
      <List sx={{ width: "100%" }} component="nav">
        {matches?.map((entry, idx) => (
          <ListItemButton key={idx}>
            <ListItemText primary={entry.entry.name} />
          </ListItemButton>
        ))}
      </List>
    );
  }
);

export const SecretList: React.FC = () => {
  const { selectedStore } = useContext(BackendContext);
  const [secretList] = useBackend(() => {
    if (!selectedStore) return undefined;

    return commands.storeList(selectedStore.name, {
      url: null,
      tag: null,
      type: null,
      name: null,
    });
  }, [selectedStore]);
  return <SecretListView matches={secretList?.entries} />;
};
