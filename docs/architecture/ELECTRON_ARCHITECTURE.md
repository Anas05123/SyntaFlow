# CoreDesk — Electron Desktop Architecture

> **Status:** IMPLEMENTED  
> **Last verified:** 2026-09-14  
> **Relevant source areas:** `apps/desktop/electron/main.cjs`, `apps/desktop/electron/preload.cjs`, `apps/desktop/electron/window-state.cjs`, `apps/desktop/electron/auth/`, `apps/desktop/electron/start.mjs`  
> **Owner domain:** Desktop Engineering & Runtime  

---

## 1. Process Model & Boundaries

CoreDesk runs as a multi-process Electron desktop application:
1. **Main Process (`apps/desktop/electron/main.cjs`)**: Privileged Node.js environment owning native OS interactions, BrowserWindow lifecycle, native menus, window geometry persistence, and authentication management.
2. **Preload Script (`apps/desktop/electron/preload.cjs`)**: Sandboxed bridge executing before any renderer script runs, exposing narrow, explicit APIs via `contextBridge.exposeInMainWorld()`.
3. **Renderer Process (`apps/desktop/src/`)**: Pure unprivileged browser context rendering React 19 UI with zero direct Node.js or OS capabilities.

```
React Renderer (Unprivileged)
       │
       │ Calls window.coreDeskDesktop.window.minimize()
       │ Calls window.coreDeskDesktop.auth.signIn(creds)
       ▼
Preload Bridge (Sandboxed contextBridge)
       │
       │ Dispatches ipcRenderer.send('coredesk:window', 'minimize')
       │ Invokes ipcRenderer.invoke('coredesk:auth:sign-in', creds)
       ▼
Electron Main Process (Privileged Node.js)
       │
       │ Listens on ipcMain.on('coredesk:window') / ipcMain.handle('coredesk:auth:*')
       ▼
Native OS Window Manager / LocalAuthProvider (scrypt + safeStorage)
```

---

## 2. Window Configuration & Frameless Chrome

The application runs in a frameless window (`frame: false`), allowing the CoreDesk top command bar to serve as the structural header:

```javascript
const { win, safeBounds } = createWindow();

// In main.cjs:
const win = new BrowserWindow({
  x: safeBounds.x,
  y: safeBounds.y,
  width: safeBounds.width,
  height: safeBounds.height,
  minWidth: 960,
  minHeight: 640,
  show: false,                // Created hidden until ready-to-show
  backgroundColor: '#0B0D0F', // Eliminates white flash before first paint
  title: 'CoreDesk',
  icon: APP_ICON_PATH,        // Multi-resolution ICO (Windows) or high-res PNG
  frame: false,               // Frameless desktop chrome
  autoHideMenuBar: true,
  resizable: true,
  roundedCorners: true,       // Native Windows 11 rounded window edges
  hasShadow: true,
  webPreferences: {
    preload: path.join(__dirname, 'preload.cjs'),
    nodeIntegration: false,   // Strictly disabled
    contextIsolation: true,  // Strictly enabled
    sandbox: true,           // Sandboxed renderer process
    webSecurity: true,
    allowRunningInsecureContent: false,
    zoomFactor: 1,
  },
});
```

### 2.1 Application Identity & Taskbar Integration
- **AUMID (`app.setAppUserModelId`)**: Configured as `'com.coredesk.app'` on Windows to ensure taskbar buttons, shortcuts, and jump lists group under the CoreDesk brand rather than inheriting the generic runtime `electron.exe`.
- **Application Icon (`icon: APP_ICON_PATH`)**: Points to `apps/desktop/electron/icon.ico` (multi-resolution Windows ICO containing 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, and 256x256 pixel layers) with automatic fallback to high-resolution PNG (`icon.png`).
- **Runtime Binding**: In addition to the `BrowserWindow` constructor option, `win.setIcon(APP_ICON_PATH)` is invoked during window initialization to guarantee the Windows shell updates the taskbar icon immediately.

---

## 3. Window State Persistence & Multi-Monitor Safety

Window geometry is managed exclusively by the privileged main process via `apps/desktop/electron/window-state.cjs`:

1. **Persisted Model (`DesktopWindowState`)**:
   - `x`, `y`: Top-left position.
   - `width`, `height`: Restored/normal dimensions.
   - `maximized`: Boolean indicating maximized state.
   - `version`: Schema version.
2. **Normal Bounds Protection**:
   - The last normal (unmaximized, non-minimized) bounds are tracked independently.
   - Closing while maximized preserves `maximized: true` alongside previous normal dimensions.
   - Closing while minimized **never** saves minimized coordinates (-32000) or alters normal bounds. Reopening restores the last visible normal geometry.
3. **Multi-Monitor Safety**:
   - On startup, coordinates are checked against all displays via `screen.getAllDisplays()`.
   - If coordinates fall outside all available display work areas (e.g. an external monitor was disconnected), the window is safely centered on the primary display and clamped to minimum usable size (min 960x640).
4. **Disk Throttling**:
   - `resize` and `move` events are debounced by 500ms.
   - An immediate synchronous write occurs on window `close`.

---

## 4. Single-Instance Application Lock

CoreDesk enforces single-instance desktop behavior in interactive runs:
- `app.requestSingleInstanceLock()` prevents competing instances from running concurrently.
- When a second instance is launched, the primary window is restored (if minimized) and brought to foreground focus.
- Automated survey/test runs (`--survey` or `CD_SURVEY=1`) bypass this lock.

---

## 5. Production Reload / Refresh Protection

To prevent users from accidentally reloading the renderer and losing transient UI state:
- In production (`mode === 'built'`), reload accelerators (`F5`, `Ctrl+R`, `Ctrl+Shift+R`, `Cmd+R`) are intercepted and prevented via `webContents.on('before-input-event')`.
- Default Electron application menus with reload actions are stripped via `Menu.setApplicationMenu(null)`.
- **Development Exception**: When `mode === 'dev'`, reload shortcuts remain enabled for developer ergonomics and Vite HMR.
- **Shortcut Safety**: Normal productivity shortcuts (`Ctrl+C`, `Ctrl+V`, `Ctrl+Z`, `Ctrl+K`, text input) are never blocked.

---

## 6. Preload Bridge API Contract

The preload bridge (`preload.cjs`) exposes `window.coreDeskDesktop`:

```javascript
contextBridge.exposeInMainWorld('coreDeskDesktop', {
  runtime: 'electron',
  electron: process.versions.electron,
  platform: process.platform,

  window: {
    minimize: () => ipcRenderer.send('coredesk:window', 'minimize'),
    toggleMaximize: () => ipcRenderer.send('coredesk:window', 'maximize'),
    close: () => ipcRenderer.send('coredesk:window', 'close'),
    onStateChange: (handler) => { ... },
  },

  auth: {
    getSession: () => ipcRenderer.invoke('coredesk:auth:get-session'),
    signIn: (credentials) => ipcRenderer.invoke('coredesk:auth:sign-in', credentials),
    signUp: (payload) => ipcRenderer.invoke('coredesk:auth:sign-up', payload),
    signOut: () => ipcRenderer.invoke('coredesk:auth:sign-out'),
  },
});
```

### Prohibited Preload Capabilities
- ❌ No raw `ipcRenderer` exposure.
- ❌ No generic `invoke(channel, payload)` exposure.
- ❌ No `fs`, `path`, or `child_process` exposure.
- ❌ No direct database driver or crypto exposure.

---

## 7. Execution Modes

- **Dev Mode (`npm run desktop:dev`)**: Loads `http://localhost:5173` with Vite HMR for real-time desktop UI development.
- **Built Mode (`npm run desktop` / `node electron/start.mjs`)**: Loads `dist/index.html` from local disk via `pathToFileURL()`, representing the exact shippable desktop binary environment.
