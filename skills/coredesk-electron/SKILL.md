---
name: coredesk-electron
description: Use for CoreDesk Electron main process, preload bridge, frameless window chrome, IPC handlers, and desktop packaging.
---

# CoreDesk Electron Desktop Skill

## Purpose
Use when modifying Electron main process (`main.cjs`), preload scripts (`preload.cjs`), window management, or IPC channels.

## Required Reading (Read First)
1. [`docs/architecture/ELECTRON_ARCHITECTURE.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/architecture/ELECTRON_ARCHITECTURE.md)
2. [`docs/security/SECURITY_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/security/SECURITY_MODEL.md)

## Key Source Directories
- `apps/desktop/electron/`
- `apps/desktop/electron/`
- `apps/desktop/src/preload/`

## Non-Negotiable Rules
- **Sandboxed Security**: `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true` must never be weakened.
- **Narrow Preload Bridge**: Expose only explicit, named methods via `contextBridge.exposeInMainWorld()`. Never expose raw `ipcRenderer` or generic `invoke(channel, ...)`.
- **External URL Handling**: External links must be intercepted via `setWindowOpenHandler` and passed to `shell.openExternal()`. Never open external URLs inside the app window.
- **Frameless Window Controls**: Maintain the `coredesk:window-state` synchronization protocol for maximize/restore glyph states.

## Validation Commands
```bash
cd apps/desktop
npm run check:electron
```
Confirm frameless window launches with `#0B0D0F` canvas background and working window controls.

## Post-Work Documentation Updates
- Update [`docs/architecture/ELECTRON_ARCHITECTURE.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/architecture/ELECTRON_ARCHITECTURE.md) if bridge methods or window options change.
- Update [`docs/security/SECURITY_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/security/SECURITY_MODEL.md) if IPC boundaries change.
