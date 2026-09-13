# CoreDesk — Known Issues & Technical Debt

> **Status:** AUDITED & DOCUMENTED  
> **Last verified:** 2026-09-14  
> **Owner domain:** Engineering Operations  

---

## 1. Technical Debt & Outstanding Issues

### ISSUE-001: Local Storage Persistence in Desktop App
- **Area**: Persistence / Data Architecture
- **Severity**: Medium
- **Description**: `apps/desktop` currently stores workspace entities in `localStorage` (`coredesk.state.v1`). While fast for prototype and initial desktop use, it lacks ACID guarantees, binary storage capabilities, and multi-megabyte scaling.
- **Reproduction**: Opening devtools shows complete state serialized into browser `localStorage`.
- **Impact**: Storage limit is ~5MB-10MB; large file attachments or extensive activity logs could hit browser quota limits.
- **Temporary Workaround**: In-memory state pruning and lean JSON payloads.
- **Planned Resolution**: Complete Phase 2 database migration to link `apps/desktop` to the SQLite backend (`database/migrations/`).

---

### ISSUE-002: Simulated PDF Generation
- **Area**: Document Studio
- **Severity**: Low
- **Description**: Clicking "Export PDF" in `DocumentWorkspaceScreen.tsx` displays a simulated toast rather than generating a true binary PDF file.
- **Reproduction**: Click "Export PDF" on any document.
- **Impact**: Operator cannot hand off physical PDF files to clients who do not use the web portal.
- **Temporary Workaround**: Use OS print dialog (`Ctrl+P`) via browser engine.
- **Planned Resolution**: Implement Electron `webContents.printToPDF()` in `main.cjs` and expose via typed preload method.

---

### ISSUE-003: Simulated Guest Token Verification
- **Area**: Security & Guest Portal
- **Severity**: Medium
- **Description**: Guest review screens accept arbitrary `?token=` query strings without verifying against a persistent table of cryptographic hashes.
- **Reproduction**: Navigate to `#/guest/review?token=test`.
- **Impact**: In development/local mode, any token string loads the mock review data.
- **Temporary Workaround**: Suitable for local review flow testing; not exposed to public networks.
- **Planned Resolution**: Implement Ed25519 token validation when hosting the external relay portal.

---

### ISSUE-004: Dual Monorepo and Sub-App Structure (`RESOLVED`)
- **Area**: Repository Organization
- **Severity**: Resolved
- **Description**: The repository previously contained split roots (`project-atlas/` monorepo and `coredesk-app/`).
- **Resolution**: Consolidated into a unified monorepo: `apps/desktop/`, `packages/ai-engine/`, `packages/contracts/`, `database/`, and `docs/`. Single root `package.json` and unified pnpm workspace.

---

### ISSUE-005: Desktop Window State Memory & Multi-Monitor Recovery (`RESOLVED`)
- **Area**: Electron Desktop Runtime
- **Severity**: Resolved
- **Description**: Desktop window previously did not remember bounds between launches, risked reopening offscreen when external monitors disconnected, and lacked maximized state memory.
- **Resolution**: Implemented `apps/desktop/electron/window-state.cjs`. Persists normal bounds and maximized states, debounces disk operations by 500ms, clamps minimum dimensions to 960x640, prevents reopening minimized, and automatically centers windows onto the primary display if saved coordinates fall outside active display work areas.

---

### ISSUE-006: Local Authentication & Secure Credential Storage (`RESOLVED`)
- **Area**: Security & Authentication
- **Severity**: Resolved
- **Description**: Desktop app previously lacked real credential authentication, session persistence, and secure token storage.
- **Resolution**: Implemented `LocalAuthProvider` (`apps/desktop/electron/auth/auth-provider.cjs`). Email normalized, passwords hashed using Node.js `crypto.scrypt` with 16-byte random salts, timing-safe verification, active session tokens encrypted at rest via Electron `safeStorage`, and safe `LastWorkspaceContext` session restoration with store record validation.
