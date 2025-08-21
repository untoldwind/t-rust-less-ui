import React, { useContext } from "react";
import { UnlockStore } from "./unlock-store";
import { ListSecretsHotkeys } from "./list-secrets-hotkeys";
import { Configuration } from "./configuration";
import { MainStateContext } from "../contexts/main-state";
import { BrowseStateProvider } from "../contexts/browse-state";

export const MainFrame: React.FC = () => {
  const mainState = useContext(MainStateContext);

  switch (mainState.mainPanel) {
    case "unlock":
      return <UnlockStore />;
    case "browse":
      if (mainState.selectedStore && !mainState.status.locked) {
        return (
          <BrowseStateProvider
            storeName={mainState.selectedStore!!}
            unlockedBy={mainState.status.unlocked_by}
          >
            <ListSecretsHotkeys />
          </BrowseStateProvider>
        );
      } else {
        return <UnlockStore />;
      }
    case "config":
      return <Configuration />;
  }
};
