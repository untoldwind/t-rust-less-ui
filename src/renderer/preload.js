const { ipcRenderer } = require("electron");

window.ipcRenderer = ipcRenderer;
window.displayName = process.env.DISPLAY || "";
