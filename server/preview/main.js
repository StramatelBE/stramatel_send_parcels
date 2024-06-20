import dotenv from 'dotenv';
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.development') });

let mainWindow;


function createWindow() {
    mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: parseInt(process.env.VITE_REACT_APP_PREVIEW_WIDTH, 10),
        height: parseInt(process.env.VITE_REACT_APP_PREVIEW_HEIGHT, 10),
        frame: false,

    });
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(process.env.VITE_REACT_APP_PREVIEW_URL);
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