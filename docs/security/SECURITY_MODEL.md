# CoreDesk — Security Model & Threat Mitigations

> **Status:** IMPLEMENTED in Desktop Runtime / SPECIFIED for Guest Access  
> **Last verified:** 2026-09-14  
> **Relevant source areas:** `apps/desktop/electron/main.cjs`, `apps/desktop/electron/preload.cjs`, `apps/desktop/electron/auth/`, `tests/security/`  
> **Owner domain:** Application Security  

---

## 1. Security Architecture Principles

1. **Principle of Least Privilege**: The renderer operates in a restricted web sandbox (`contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`). It has no direct access to OS primitives, file paths, child processes, or crypto libraries.
2. **Strict Defense in Depth**: Preload scripts expose only explicit, named methods via `contextBridge`. IPC handlers validate all incoming payloads before delegating to internal services.
3. **Local Sovereignty**: Sensitive client information, financials, private notes, and credentials are stored locally on the operator's disk and never dispatched to unverified cloud services.
4. **Isolated Guest Access**: Guest review permissions are narrowly scoped to a single document version; guest access never grants access to sibling projects or workspace databases.
5. **Zero Plaintext Credentials**: Passwords and session keys are never stored in plaintext or web localStorage.

---

## 2. Threat & Mitigation Matrix

| # | Threat | Severity | Mitigation | Responsible Layer |
|---|---|---|---|---|
| **T-01** | **Renderer Remote Code Execution (RCE)** | Critical | `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`. No Node globals exposed to renderer. | Electron Main & Preload |
| **T-02** | **Arbitrary IPC Injection** | High | No generic `ipcRenderer.send()` or `invoke()` exposed. Preload provides only specific named methods. In main process, IPC payloads are validated prior to execution. | Preload Bridge & IPC Handlers |
| **T-03** | **Malicious External Link Hijacking** | High | `setWindowOpenHandler` denies all window creation and delegates external `https://` URLs strictly to OS default browser via `shell.openExternal()`. | Electron Main Process |
| **T-04** | **Cross-Client Data Leakage** | High | Relational queries enforce client/project boundaries. Guest review surfaces accept only version-scoped tokens. | Application Services & Database |
| **T-05** | **Tampering with Submitted Reviews** | High | Submitted `DocVersion` records are immutable. Review decisions target exact version hashes. | Domain Layer & State Reducers |
| **T-06** | **Local AI Prompt Injection / Jailbreak** | Medium | User prompts pass through `TaskRouter` and `PromptRegistry` with strict system prompt boundaries. LLM output is validated against Zod contracts before UI render. | AI Engine (`@coredesk/ai-engine`) |
| **T-07** | **SSRF via Local AI Endpoint** | Medium | Ollama connection is hardcoded to local loopback (`http://127.0.0.1:11434`). Arbitrary user-entered URLs for inference endpoints are prohibited without explicit settings validation. | AI Engine Provider Adapter |
| **T-08** | **Session & Credential Exposure** | High | Passwords hashed with Node.js `crypto.scrypt` using 16-byte random salts. Verification uses `crypto.timingSafeEqual`. Active session tokens are encrypted at rest using Electron `safeStorage` (OS DPAPI / Keychain). | Electron Main & LocalAuthProvider |
| **T-09** | **Transient State Loss via Unintended Reload** | Medium | In production, `F5`, `Ctrl+R`, `Ctrl+Shift+R`, and `Cmd+R` are intercepted and blocked at the Electron window layer. Development mode preserves reload. | Electron Main Process (`before-input-event`) |

---

## 3. Sandboxing & Preload Boundaries

```javascript
// apps/desktop/electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

const WINDOW_CHANNELS = new Set(['coredesk:window-state']);

contextBridge.exposeInMainWorld('coreDeskDesktop', {
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
});
```

---

## 4. Guest Review Access Isolation

When an external client reviews a document:
1. **Scoped Token**: The invite URL contains a cryptographically secure token:
   `https://review.coredesk.app/#/guest/review?token=<SECURE_TOKEN>&doc=<DOC_ID>&v=<VERSION>`
2. **Access Confinement**: The token resolves only the designated `DocVersion` and its immediate feedback comments.
3. **Zero Lateral Movement**: The guest context cannot query other documents, clients, financial totals, or workspace activity feeds.
