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

const integrationsApi = {
  listDefinitions: () => ipcRenderer.invoke('syntaflow:integrations:list-definitions'),
  getConnection: (id) => ipcRenderer.invoke('syntaflow:integrations:get-connection', id),
  connect: (id, options) => ipcRenderer.invoke('syntaflow:integrations:connect', { id, options }),
  cancelConnect: (id) => ipcRenderer.invoke('syntaflow:integrations:cancel-connect', id),
  disconnect: (id) => ipcRenderer.invoke('syntaflow:integrations:disconnect', id),
  testConnection: (id) => ipcRenderer.invoke('syntaflow:integrations:test-connection', id),
  checkHealth: (id, forceRefresh) => ipcRenderer.invoke('syntaflow:integrations:check-health', { id, forceRefresh }),
  reconnect: (id) => ipcRenderer.invoke('syntaflow:integrations:reconnect', id),
  updateAgentAccess: (id, agentAccess) => ipcRenderer.invoke('syntaflow:integrations:update-agent-access', { id, agentAccess }),
  executeCapability: (capabilityId, params) => ipcRenderer.invoke('syntaflow:integrations:execute-capability', { capabilityId, params }),
  connectAll: (options) => ipcRenderer.invoke('syntaflow:integrations:connect-all', options),
  disconnectAll: () => ipcRenderer.invoke('syntaflow:integrations:disconnect-all'),
};

const desktopApi = {
  runtime: 'electron',
  electron: process.versions.electron,
  platform: process.platform,

  window: {
    minimize: () => ipcRenderer.send('coredesk:window', 'minimize'),
    toggleMaximize: () => ipcRenderer.send('coredesk:window', 'maximize'),
    close: () => ipcRenderer.send('coredesk:window', 'close'),

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

  integrations: integrationsApi,
};

contextBridge.exposeInMainWorld('syntaflowDesktop', desktopApi);
contextBridge.exposeInMainWorld('coreDeskDesktop', desktopApi);
