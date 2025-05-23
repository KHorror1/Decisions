const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const userDataPath = app.getPath('userData');
const filePath = path.join(userDataPath, 'presets.json');

function loadPresets() {
  try {
    if (!fs.existsSync(filePath)) return {};
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '{}');
  } catch (err) {
    console.error('Error reading presets:', err);
    return {};
  }
}

function savePresets(presets) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(presets, null, 2));
  } catch (err) {
    console.error('Error writing presets:', err);
  }
}

module.exports = {
  loadPresets,
  savePresets,
};
