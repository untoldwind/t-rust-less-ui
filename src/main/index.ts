import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import { registerBackend } from "./backend-neon";

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow: BrowserWindow | null = null;

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDevelopment) {
    const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

    installExtension(REDUX_DEVTOOLS)
      .then((name: any) => console.log(`Added Extension:  ${name}`))
      .catch((err: any) => console.log('An error occurred: ', err));

    window.webContents.on('devtools-opened', () => {
      window.webContents.focus();
      setImmediate(() => {
        window.webContents.focus();
      });
    });

    window.webContents.openDevTools();
    window.loadURL("http://localhost:8123");
  } else {
    window.removeMenu();
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  window.on('closed', () => {
    mainWindow = null;
  })

  return window;
}

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createWindow();
  }
});

app.on("ready", () => {
  mainWindow = createWindow();

  registerBackend();
});
