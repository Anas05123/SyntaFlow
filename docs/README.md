# CoreDesk Architecture & Knowledge Router

> **Purpose:** This file is the universal documentation router for CoreDesk. Any AI agent (Claude, Codex, ChatGPT, Gemini) working in this repository must use this router to identify the exact documents required for its task. Do **NOT** scan the entire documentation tree or source codebase before every task.

---

## Documentation Freshness Metadata

- **Status:** IMPLEMENTED
- **Last verified:** 2026-09-13
- **Primary Runtime:** `apps/desktop` (React 19, TypeScript, Vite, Electron)
- **Packages:** `packages/ai-engine` (@coredesk/ai-engine), `packages/contracts` (@coredesk/contracts)
- **Database:** `database/migrations/`
- **Owner Domain:** Architecture & Engineering Operations

---

## Task Routing Matrix

Identify your assigned task domain below and read **ONLY** the designated required documents.

| Task Domain | Primary Skill | Required Documents | Key Source Locations |
|---|---|---|---|
| **UI, Screens & Design System** | `skills/coredesk-ui` | [`docs/design/UI_UX_SYSTEM.md`](design/UI_UX_SYSTEM.md)<br>[`docs/design/DESIGN_SYSTEM.md`](design/DESIGN_SYSTEM.md)<br>[`docs/00-start-here/Development Status.md`](00-start-here/Development%20Status.md) | `apps/desktop/src/screens/`<br>`apps/desktop/src/components/`<br>`apps/desktop/src/styles/` |
| **Tasks Workspace & Drag-and-Drop** | `skills/coredesk-ui`<br>`skills/coredesk-data` | [`docs/systems/TASK_SYSTEM.md`](systems/TASK_SYSTEM.md)<br>[`docs/architecture/DATA_MODEL.md`](architecture/DATA_MODEL.md)<br>[`docs/product/DOMAIN_RULES.md`](product/DOMAIN_RULES.md) | `apps/desktop/src/screens/TasksScreen.tsx`<br>`apps/desktop/src/components/TaskPanel.tsx`<br>`apps/desktop/src/domain/types.ts`<br>`apps/desktop/src/state/store.tsx` |
| **Database & Persistence Migration** | `skills/coredesk-data` | [`docs/architecture/DATA_MODEL.md`](architecture/DATA_MODEL.md)<br>[`docs/product/DOMAIN_RULES.md`](product/DOMAIN_RULES.md)<br>[`docs/architecture/SYSTEM_ARCHITECTURE.md`](architecture/SYSTEM_ARCHITECTURE.md) | `apps/desktop/src/state/db.ts`<br>`apps/desktop/src/state/store.tsx`<br>`database/migrations/` |
| **Electron Main, Preload & IPC** | `skills/coredesk-electron` | [`docs/architecture/ELECTRON_ARCHITECTURE.md`](architecture/ELECTRON_ARCHITECTURE.md)<br>[`docs/security/SECURITY_MODEL.md`](security/SECURITY_MODEL.md) | `apps/desktop/electron/main.cjs`<br>`apps/desktop/electron/preload.cjs` |
| **Document Studio, Versions & Review** | `skills/coredesk-documents` | [`docs/systems/DOCUMENT_SYSTEM.md`](systems/DOCUMENT_SYSTEM.md)<br>[`docs/systems/REVIEW_DELIVERY_SYSTEM.md`](systems/REVIEW_DELIVERY_SYSTEM.md)<br>[`docs/security/ACCESS_MODEL.md`](security/ACCESS_MODEL.md) | `apps/desktop/src/screens/DocumentWorkspaceScreen.tsx`<br>`apps/desktop/src/screens/guest/`<br>`apps/desktop/src/domain/types.ts` |
| **Security, Sandboxing & Grants** | `skills/coredesk-security` | [`docs/security/SECURITY_MODEL.md`](security/SECURITY_MODEL.md)<br>[`docs/security/ACCESS_MODEL.md`](security/ACCESS_MODEL.md)<br>[`docs/architecture/ELECTRON_ARCHITECTURE.md`](architecture/ELECTRON_ARCHITECTURE.md) | `apps/desktop/electron/main.cjs`<br>`apps/desktop/electron/preload.cjs`<br>`tests/security/` |
| **AI Engine & Ollama Pipeline** | `skills/coredesk-product` | [`docs/architecture/AI_ARCHITECTURE.md`](architecture/AI_ARCHITECTURE.md)<br>[`docs/architecture/SYSTEM_ARCHITECTURE.md`](architecture/SYSTEM_ARCHITECTURE.md) | `packages/ai-engine/`<br>`packages/contracts/` |
| **Product Strategy & Roadmap** | `skills/coredesk-product` | [`docs/product/PRODUCT_VISION.md`](product/PRODUCT_VISION.md)<br>[`docs/product/CLIENT_LIFECYCLE.md`](product/CLIENT_LIFECYCLE.md)<br>[`docs/roadmap/ROADMAP.md`](roadmap/ROADMAP.md) | `docs/research/`<br>`docs/00-start-here/` |
| **Marketing Website & Web Auth Handoff** | `skills/coredesk-product` | [`docs/product/WEBSITE_HANDOFF.md`](product/WEBSITE_HANDOFF.md)<br>[`docs/product/PRODUCT_VISION.md`](product/PRODUCT_VISION.md)<br>[`docs/design/DESIGN_SYSTEM.md`](design/DESIGN_SYSTEM.md) | `apps/web/README.md` |
| **Testing, Quality Assurance & QA** | `skills/coredesk-testing` | [`docs/architecture/TESTING_STRATEGY.md`](architecture/TESTING_STRATEGY.md)<br>[`docs/00-start-here/Development Status.md`](00-start-here/Development%20Status.md) | `apps/desktop/verify-app.mjs`<br>`apps/desktop/measure-layout.mjs`<br>`tests/` |

---

## Canonical Document Catalog

### 00 - Start Here (Vault Orientation)
- [`00-start-here/CoreDesk Home.md`](00-start-here/CoreDesk%20Home.md): Human dashboard & Obsidian vault homepage.
- [`00-start-here/Development Status.md`](00-start-here/Development%20Status.md): Verified working flows, current routes, and active components.
- [`00-start-here/Documentation Map.md`](00-start-here/Documentation%20Map.md): Complete directory map of documentation.
- [`00-start-here/GLOSSARY.md`](00-start-here/GLOSSARY.md): Canonical terminology definitions preventing semantic drift.

### 01 - Product & Commercial Operations
- [`product/PRODUCT_VISION.md`](product/PRODUCT_VISION.md): Purpose, target persona, 5 acceptance gates, what it is and is not.
- [`product/CLIENT_LIFECYCLE.md`](product/CLIENT_LIFECYCLE.md): 9-stage commercial journey graph, entry/exit criteria, waiting states.
- [`product/PRODUCT_ARCHITECTURE.md`](product/PRODUCT_ARCHITECTURE.md): Feature breakdown, operational hierarchy, system interaction.
- [`product/DOMAIN_RULES.md`](product/DOMAIN_RULES.md): Strict business invariants with preconditions, actions, side effects, failure modes.
- [`product/WEBSITE_HANDOFF.md`](product/WEBSITE_HANDOFF.md): Website specifications and deep-link desktop callback protocols.

### 02 - System Architecture & Engineering
- [`architecture/SYSTEM_ARCHITECTURE.md`](architecture/SYSTEM_ARCHITECTURE.md): Layered software architecture, boundaries, prohibited shortcuts.
- [`architecture/DATA_MODEL.md`](architecture/DATA_MODEL.md): Canonical schema for all 18+ entities, immutability rules, ER diagram.
- [`architecture/ELECTRON_ARCHITECTURE.md`](architecture/ELECTRON_ARCHITECTURE.md): Frameless BrowserWindow, custom chrome, sandboxed contextIsolation.
- [`architecture/AI_ARCHITECTURE.md`](architecture/AI_ARCHITECTURE.md): CoreDesk AI Engine pipeline, Task Router, Context Builder, Prompt Registry, Ollama adapter.
- [`architecture/CODING_STANDARDS.md`](architecture/CODING_STANDARDS.md): TypeScript strictness, naming, boundaries, state ownership.
- [`architecture/TESTING_STRATEGY.md`](architecture/TESTING_STRATEGY.md): Test hierarchy, unit/integration/E2E, responsive targets (1280, 1440, 1920).
- [`architecture/FILE_STRUCTURE.md`](architecture/FILE_STRUCTURE.md): Directory map explaining purpose, ownership, and content rules for every folder.

### 03 - Operational Subsystems
- [`systems/TASK_SYSTEM.md`](systems/TASK_SYSTEM.md): Three decoupled dimensions (Status, Attention, Priority), prerequisite dependencies, inspector.
- [`systems/DOCUMENT_SYSTEM.md`](systems/DOCUMENT_SYSTEM.md): Document studio, types, working versions vs submitted immutable snapshots (`DocVersion`).
- [`systems/REVIEW_DELIVERY_SYSTEM.md`](systems/REVIEW_DELIVERY_SYSTEM.md): Review requests, revision loops, decisions, delivery packages, gate enforcement.
- [`systems/SEARCH_COMMAND_SYSTEM.md`](systems/SEARCH_COMMAND_SYSTEM.md): Universal multi-entity search, `⌘K` command palette.
- [`systems/SETTINGS_APPEARANCE.md`](systems/SETTINGS_APPEARANCE.md): Appearance popover, wallpaper engine, blur/dim sliders, surface opacity.
- [`systems/ERROR_RECOVERY.md`](systems/ERROR_RECOVERY.md): System resilience: database errors, save failures, AI timeouts, network errors, drop rollbacks.

### 04 - Visual Design & UX
- [`design/UI_UX_SYSTEM.md`](design/UI_UX_SYSTEM.md): Spatial hierarchy: top bar, sidebar, workspace, responsive inspector, popovers.
- [`design/DESIGN_SYSTEM.md`](design/DESIGN_SYSTEM.md): Dark graphite hierarchy, cobalt/cyan accents, tokens, typography, glass controls.

### 05 - Security & Access Control
- [`security/SECURITY_MODEL.md`](security/SECURITY_MODEL.md): Threat and mitigation matrix, external links, IPC validation, guest review isolation.
- [`security/ACCESS_MODEL.md`](security/ACCESS_MODEL.md): Non-inherited access grant principles (`recipient + resource + role + expiry + revocation`).

### 06 - Roadmap & Governance
- [`roadmap/ROADMAP.md`](roadmap/ROADMAP.md): NOW, NEXT, LATER, EXPERIMENTAL development phases.
- [`roadmap/KNOWN_ISSUES.md`](roadmap/KNOWN_ISSUES.md): Documented technical debt and known limitations with planned resolutions.
- [`decisions/DECISIONS.md`](decisions/DECISIONS.md): Architecture Decision Records index (`ADR-001` through `ADR-012`).

### 07 - Research, Migration & History
- [`research/`](research/): Foundational research briefs and early product context.
- [`migration/`](migration/): Repository audit, Atlas remainder log, and migration reports.
- [`archive/`](archive/): Historical Project Atlas notes (with disclaimer banners) and prototype archives.
