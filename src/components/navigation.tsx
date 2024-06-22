import React, { useContext, useEffect } from "react";
import { Unlock } from "./unlock/unlock";
import { Lookup } from "./lookup/lookup";
import { BackendContext } from "../backend/provider";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { ColorModeContext } from "../main";
import { Brightness4, Brightness7, Lock, Settings } from "@mui/icons-material";

export interface NavigationState {
  page: "Unlock" | "Lookup";
}

export const NavigationContext = React.createContext<NavigationState>({
  page: "Unlock",
});

export const Navigation: React.FC = () => {
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);
  const { status, lockStore } = useContext(BackendContext);
  const [page, setPage] = React.useState<NavigationState["page"]>("Unlock");

  function pageComponent() {
    switch (page) {
      case "Unlock":
        return <Unlock />;
      case "Lookup":
        return <Lookup />;
    }
  }

  useEffect(() => {
    if (!status) return;
    if (page === "Unlock" && !status.locked) setPage("Lookup");
    if (page === "Lookup" && status.locked) setPage("Unlock");
  }, [status]);

  return (
    <NavigationContext.Provider value={{ page }}>
      <Box sx={{ display: "flex" }}>
        <AppBar>
          <Toolbar variant="dense">
            <Box sx={{ flexGrow: 1 }} />
            {status?.unlocked_by && (
              <IconButton sx={{ ml: 1 }} onClick={lockStore} color="inherit">
                <Lock />
              </IconButton>
            )}
            <IconButton
              sx={{ ml: 1 }}
              onClick={toggleColorMode}
              color="inherit"
            >
              {colorMode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton sx={{ ml: 1 }} color="inherit">
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>
        {pageComponent()}
      </Box>
    </NavigationContext.Provider>
  );
};
