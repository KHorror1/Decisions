const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const presetStorage = require('./preset-storage');

const expressApp = express();
const PORT = 3000;
const distPath = path.join(__dirname, 'client', 'dist', 'client', 'browser');

expressApp.use(express.static(distPath));
expressApp.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

expressApp.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "Decisions",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // <-- this is essential
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(createWindow);

// IPC handlers
ipcMain.handle('get-presets', () => {
  return presetStorage.loadPresets();
});

ipcMain.handle('save-presets', (event, presets) => {
  presetStorage.savePresets(presets);
});
