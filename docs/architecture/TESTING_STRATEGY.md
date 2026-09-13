# CoreDesk — Testing & Quality Assurance Strategy

> **Status:** IMPLEMENTED across multiple test harnesses  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `tests/`, `apps/desktop/verify-app.mjs`, `apps/desktop/package.json`  
> **Owner domain:** Quality Assurance & Testing  

---

## 1. Testing Pyramid & Subsystems

CoreDesk employs a layered testing pyramid designed for fast local feedback and desktop fidelity:

```
                  ┌──────────────────────┐
                  │ Playwright E2E & QA  │  (Multi-viewport desktop inspection)
                  ├──────────────────────┤
                  │ Security Contracts   │  (Preload API, isolation, boundary specs)
                  ├──────────────────────┤
                  │ Integration Tests    │  (AI engine pipeline, task router, IPC)
                  ├──────────────────────┤
                  │ Unit Tests & Types   │  (Domain reducers, Zod contracts, tsc)
                  └──────────────────────┘
```

---

## 2. Test Suites & Execution Inventory

### 2.1 Static Analysis & Compilation (`npm run build`, `npm run lint`)
- **TypeScript**: `tsc -b` runs in strict mode across all modules. 0 errors tolerated.
- **Linter**: `oxlint` validates code hygiene, unused imports, and React hooks rules.

### 2.2 Security & Boundary Tests (`tests/security/`)
- **Preload API Contract (`preload-contract.spec.ts`)**: Asserts that only approved top-level keys (`app`, `settings`, `jobs`, `coredeskAi`) exist on `CoreDeskPreloadApi`.
- **AI Engine Boundary (`ai-engine-boundary.spec.ts`)**: Verifies that direct network calls outside localhost are intercepted and that prompt inputs pass sanitization.

### 2.3 Route & Surface Verification (`apps/desktop/verify-app.mjs`)
- Runs a headless browser instance checking all hash routes:
  - `#/home`, `#/clients`, `#/projects`, `#/tasks`, `#/documents`, `#/activity`, `#/archive`, `#/settings`, `#/auth`, `#/first-run`, `#/guest/review`.
- Verifies zero console errors, zero uncaught exceptions, and correct layout box rendering.

### 2.4 Responsive Viewport Validation
Every major UI and inspector update must be verified against three standard desktop viewports:
1. **$1280 \times 720$ (Compact Laptop / Narrow Viewport)**:
   - Available workspace width is $< 1020\text{px}$.
   - Inspector must operate in **Overlay Mode** with a dismissible soft scrim (`.scrim.soft`).
   - No horizontal scrollbars on workspace body.
2. **$1440 \times 900$ (Standard Desktop / Reference Canvas)**:
   - Available workspace width is $\ge 1020\text{px}$.
   - Inspector must operate in **Side-by-Side Mode**.
   - Dimming scrim must be completely suppressed (`display: none !important`).
   - Workspace applies margin-shift (`margin-right: clamp(...)`) to prevent card obscuration.
3. **$1920 \times 1080$ (Widescreen Workstation)**:
   - Full multi-column workspace with unconstrained horizontal room for all board columns and drawer.
