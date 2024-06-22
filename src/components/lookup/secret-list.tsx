import { List, ListItemButton, ListItemText } from "@mui/material";
import React, { useContext } from "react";
import { useBackend } from "../../backend/use-backend";
import { commands } from "../../backend/bindings";
import { BackendContext } from "../../backend/provider";

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
  return (
    <List sx={{ width: "100%" }} component="nav">
      {secretList?.entries.map((entry, idx) => (
        <ListItemButton key={idx}>
          <ListItemText primary={entry.entry.name} />
        </ListItemButton>
      ))}
    </List>
  );
};
