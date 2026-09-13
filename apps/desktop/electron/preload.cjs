/**
 * Preload for the CoreDesk desktop runtime.
 *
 * Exposes explicit, narrow interfaces via contextBridge:
 * - window controls (minimize / toggleMaximize / close / onStateChange)
 * - auth bridge (getSession / signIn / signUp / signOut)
 *
 * Security Invariants:
 * - contextIsolation: true, nodeIntegration: false, sandbox: true.
 * - No raw ipcRenderer exposure.
 * - No generic invoke(channel, ...).
 * - No fs, path, child_process, or sqlite drivers exposed to the renderer.
 */

const { contextBridge, ipcRenderer } = require('electron');

const WINDOW_CHANNELS = new Set(['coredesk:window-state']);

contextBridge.exposeInMainWorld('coreDeskDesktop', {
  /** How the renderer can tell it is running as an app rather than a page. */
  runtime: 'electron',
  electron: process.versions.electron,
  platform: process.platform,

  window: {
    minimize: () => ipcRenderer.send('coredesk:window', 'minimize'),
    toggleMaximize: () => ipcRenderer.send('coredesk:window', 'maximize'),
    close: () => ipcRenderer.send('coredesk:window', 'close'),

    /**
     * Subscribes to maximize/focus changes. Returns an unsubscribe function so
     * a React effect can clean up without leaking a listener per mount.
     */
    onStateChange: (handler) => {
      if (typeof handler !== 'function') return () => {};
      const listener = (_event, state) => {
        if (WINDOW_CHANNELS.has('coredesk:window-state')) handler(state);
      };
      ipcRenderer.on('coredesk:window-state', listener);
      return () => ipcRenderer.removeListener('coredesk:window-state', listener);
    },
  },

  auth: {
    getSession: () => ipcRenderer.invoke('coredesk:auth:get-session'),
    signIn: (credentials) => ipcRenderer.invoke('coredesk:auth:sign-in', credentials),
    signUp: (payload) => ipcRenderer.invoke('coredesk:auth:sign-up', payload),
    signOut: () => ipcRenderer.invoke('coredesk:auth:sign-out'),
  },
});
