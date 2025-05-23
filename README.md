# Decisions

A desktop app built with **Angular + Electron + Express** to help you spin a random decision.

## Features

- Add items (e.g., lunch, tasks)
- Save, edit, and delete named presets
- Animated random picker with clean UI

Built by **KHorror**

---

## 🔧 How to Build the `.exe` Installer

1. **Install dependencies**

```bash
npm install
npm install --save-dev electron-builder
cd client
npm install
cd ..
```

2. Build the Angular frontend
```bash
npm run build:client
```

3. Build the Electron app and create the installer
```bash
npm run build:electron
```
4. Or run both steps at once:
```bash
npm run dist
```

After that, you’ll find your .exe installer in the dist/ folder (e.g., dist/Decisions Setup 1.0.0.exe).

