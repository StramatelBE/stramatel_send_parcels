import { app, BrowserWindow, screen } from "electron";




let mainWindow;


function createWindow() {
    const displays = screen.getAllDisplays();
    const secondDisplay = displays[1]; // Sélectionne explicitement le deuxième écran

    if (secondDisplay) {
        mainWindow = new BrowserWindow({
            x: secondDisplay.bounds.x,
            y: secondDisplay.bounds.y,
            width: 1920,
            height: 1080,
            frame: false,
            fullscreen: true,
        });
        /* mainWindow.webContents.openDevTools(); */
        mainWindow.loadURL(process.env.PREVIEW_URL);
    } else {
        console.error("Le deuxième écran n'est pas disponible.");
    }
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