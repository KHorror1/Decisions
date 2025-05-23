const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getPresets: () => ipcRenderer.invoke('get-presets'),
  savePresets: (presets) => ipcRenderer.invoke('save-presets', presets)
});
