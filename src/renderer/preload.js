const { ipcRenderer, contextBridge } = require("electron");

let idCounter = 0;

contextBridge.exposeInMainWorld('backend', {
  sendCommand: (command, callback) => {
    const replyChannel = "neon-backend-" + (idCounter++);
    ipcRenderer.once(replyChannel, callback);
    ipcRenderer.send("neon-backend", { command, replyChannel });
  },
  electronVersion: () => process.versions.electron,
  appVersion: () => process.env.appVersion,
});
