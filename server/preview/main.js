import { app, BrowserWindow } from "electron";




let mainWindow;


function createWindow() {
    mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: parseInt(process.env.PREVIEW_WIDTH, 10),
        height: parseInt(process.env.PREVIEW_HEIGHT, 10),
        frame: false,

    });
    /* mainWindow.webContents.openDevTools(); */
    mainWindow.loadURL(process.env.PREVIEW_URL);
}


app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});