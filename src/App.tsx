import { useState } from "react";
import reactLogo from "./assets/react.svg";
import tauriLogo from "./assets/tauri.svg";
import "./App.css";
import { commands } from "./bindings";
import { AppBar, Box, CssBaseline, IconButton, Toolbar } from "@mui/material";
import React from "react";
import { ColorModeContext } from "./main";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export const App: React.FC = () => {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const colorMode = React.useContext(ColorModeContext);

  async function call_greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await commands.greet(name));
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar position="absolute">
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              sx={{ ml: 1 }}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              {colorMode.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <div className="container">
            <h1>Welcome to Tauri!</h1>

            <div className="row">
              <a href="https://vitejs.dev" target="_blank">
                <img src="/vite.svg" className="logo vite" alt="Vite logo" />
              </a>
              <a href="https://tauri.app" target="_blank">
                <img src={tauriLogo} className="logo tauri" alt="Tauri logo" />
              </a>
              <a href="https://reactjs.org" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>

            <p>Click on the Tauri, Vite, and React logos to learn more.</p>

            <form
              className="row"
              onSubmit={(e) => {
                e.preventDefault();
                call_greet();
              }}
            >
              <input
                id="greet-input"
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="Enter a name..."
              />
              <button type="submit">Greet</button>
            </form>

            <p>{greetMsg}</p>
          </div>
        </Box>
      </Box>
    </>
  );
};
