import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import * as backend from "./backend";

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
        window.webContents.openDevTools();
        window.loadURL("http://localhost:8080");
    } else {
        window.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }));
    }

    window.on('closed', () => {
        mainWindow = null;
    })

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        mainWindow = createWindow();
    }
})

app.on("ready", () => {
    mainWindow = createWindow();
    console.log("Sending");

    backend.sendCommand("list_stores", result => console.log(result));
})