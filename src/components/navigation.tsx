import React, { useContext, useEffect } from "react";
import { Unlock } from "./unlock/unlock";
import { Lookup } from "./lookup/lookup";
import { BackendContext } from "../backend/provider";
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  alpha,
  styled,
} from "@mui/material";
import { ColorModeContext } from "../main";
import {
  Brightness4,
  Brightness7,
  Lock,
  Search,
  Settings,
} from "@mui/icons-material";

export interface NavigationState {
  page: "Unlock" | "Lookup";
}

export const NavigationContext = React.createContext<NavigationState>({
  page: "Unlock",
});

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export const Navigation: React.FC = () => {
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);
  const { status, lockStore } = useContext(BackendContext);
  const [page, setPage] = React.useState<NavigationState["page"]>("Unlock");
  const [search, setSearch] = React.useState<string>("");

  function pageComponent() {
    switch (page) {
      case "Unlock":
        return <Unlock />;
      case "Lookup":
        return <Lookup search={search} />;
    }
  }

  useEffect(() => {
    if (!status) return;
    if (page === "Unlock" && !status.locked) setPage("Lookup");
    if (page === "Lookup" && status.locked) {
      setSearch("");
      setPage("Unlock");
    }
  }, [status]);

  return (
    <NavigationContext.Provider value={{ page }}>
      <Box>
        <AppBar position="static">
          <Toolbar variant="dense">
            {status?.unlocked_by && (
              <SearchContainer>
                <SearchIconWrapper>
                  <Search />
                </SearchIconWrapper>
                <StyledInputBase
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </SearchContainer>
            )}
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
