const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    onUnixData: (callback) => ipcRenderer.on('unix-data', callback)
});
