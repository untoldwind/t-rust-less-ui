import React, { useContext } from "react";
import { UnlockStore } from "./unlock-store";
import { ListSecretsHotkeys } from "./list-secrets-hotkeys";
import { Configuration } from "./configuration";
import { MainStateContext } from "../contexts/main-state";
import { BrowseStateProvider } from "../contexts/browse-state";
import { Grid } from "./ui/grid";
import { useQuery } from "@tanstack/react-query";
import { viewInsets } from "../contexts/backend-tauri";
import { OffsetSpec } from "./ui/constraints";

export const MainFrame: React.FC = () => {
  const mainState = useContext(MainStateContext);
  const { data: padding } = useQuery({
    queryKey: ["view-insets"],
    queryFn: async () => {
      const rect = await viewInsets();
      return [rect.top, rect.right, rect.bottom, rect.left] as OffsetSpec;
    },
  });

  switch (mainState.mainPanel) {
    case "unlock":
      return (
        <Grid columnSpec="1fr" height={[100, "vh"]} padding={padding}>
          {" "}
          <UnlockStore />
        </Grid>
      );
    case "browse":
      if (mainState.selectedStore && !mainState.status.locked) {
        return (
          <Grid columnSpec="1fr" height={[100, "vh"]} padding={padding}>
            <BrowseStateProvider
              storeName={mainState.selectedStore!!}
              unlockedBy={mainState.status.unlocked_by}
            >
              <ListSecretsHotkeys />
            </BrowseStateProvider>
          </Grid>
        );
      } else {
        return (
          <Grid columnSpec="1fr" height={[100, "vh"]} padding={padding}>
            <UnlockStore />
          </Grid>
        );
      }
    case "config":
      return (
        <Grid columnSpec="1fr" height={[100, "vh"]} padding={padding}>
          <Configuration />
        </Grid>
      );
  }
};
