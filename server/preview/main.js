import dotenv from 'dotenv';
import { app, BrowserWindow } from "electron";
import net from "net";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.development') });

let mainWindow;
let client;

function createWindow() {
    mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: parseInt(process.env.VITE_REACT_APP_PREVIEW_WIDTH, 10),
        height: parseInt(process.env.VITE_REACT_APP_PREVIEW_HEIGHT, 10),
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(process.env.VITE_REACT_APP_PREVIEW_URL);
}

function connectToUnixSocket() {
    console.log("Connecting to Unix socket");
    client = net.createConnection("/tmp/unixSocket.sock", () => {
        console.log("Connected to Unix socket");
        client.write("Hello, server!");
    });

    client.on("data", (data) => {
        console.log("Received: " + data);
        mainWindow.webContents.send('unix-data', data.toString());
    });

    client.on("end", () => {
        console.log("Disconnected from Unix socket");
        setTimeout(connectToUnixSocket, 10000); 
    });

    client.on("error", (err) => {
        console.error("Error: " + err.message);
        setTimeout(connectToUnixSocket, 10000); 
    });
}

app.whenReady().then(() => {
    createWindow();
    connectToUnixSocket();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});