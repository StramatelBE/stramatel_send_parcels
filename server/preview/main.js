import { app, BrowserWindow } from "electron";

function createWindow() {
    const win = new BrowserWindow({
        x: 0,
        y: 0,
        width: 960,
        height: 480,
        frame: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true
        }
    })

    win.loadURL('http://localhost:2000')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
