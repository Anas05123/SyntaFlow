# CoreDesk — Repository File & Directory Structure

> **Status:** AUDITED & STRUCTURED  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** Workspace Root  
> **Owner domain:** Repository Architecture  

---

## 1. Top-Level Directory Layout

```
CoreDesk/
├── AGENTS.md                  # Universal root AI working instructions & Nexa context
├── CLAUDE.md                  # Quick-routing pointer for Claude/agents
├── Launch-CoreDesk.bat        # Root launcher pointing to tools/launch/Launch-CoreDesk.bat
├── apps/
│   ├── desktop/               # Active desktop React 19 application & Electron wrapper
│   │   ├── electron/          # Electron main.cjs and preload.cjs bridge scripts
│   │   ├── src/               # React screens, components, domain, state, styles
│   │   └── scripts/           # Test and probe automation scripts
│   └── web/                   # Reserved boundary for future marketing/portal website
├── packages/
│   ├── ai-engine/             # @coredesk/ai-engine pipeline (TaskRouter, Ollama)
│   └── contracts/             # @coredesk/contracts (Zod schemas, preload interfaces, types)
├── database/
│   ├── migrations/            # SQLite schema migrations
│   └── scripts/               # Database management CLI scripts (status, migrate, backup)
├── tests/
│   ├── security/              # Security regression guards and boundary specs
│   ├── integration/           # AI Engine and database script integration tests
│   └── fixtures/              # Reusable test fixtures and mocks
├── assets/
│   ├── brand/                 # Canonical logo graphics and wordmarks
│   └── design/                # Figma and FigJam provenance exports
├── tools/
│   ├── brand/                 # Brand vector rendering scripts
│   └── launch/                # Standalone portable launcher and CoreDesk.exe
├── docs/                      # Unified Obsidian engineering vault & documentation
│   ├── 00-start-here/         # Human dashboard (CoreDesk Home.md), maps, status
│   ├── product/               # Product vision, user profiles, workflows
│   ├── architecture/          # System, Electron, AI, Data, Security architectures
│   ├── systems/               # Client, project, task, document, and review systems
│   ├── design/                # Design system tokens, typography, layouts
│   ├── security/              # Threat model, access control, credential handling
│   ├── roadmap/               # Phased roadmap, release criteria, known issues
│   ├── decisions/             # Architecture Decision Records (ADR-001 to ADR-012)
│   ├── research/              # Foundational UX and market research briefs
│   ├── migration/             # Repository audit, Atlas remainder log, migration reports
│   └── archive/               # Retired Project Atlas engineering handbook & history
└── skills/                    # Reusable, domain-specific CoreDesk AI skills
    ├── coredesk-product/
    ├── coredesk-ui/
    ├── coredesk-electron/
    ├── coredesk-data/
    ├── coredesk-security/
    ├── coredesk-documents/
    └── coredesk-testing/
```

---

## 2. Directory Responsibilities & Invariants

### 2.1 `apps/desktop/`
- **Purpose**: Active CoreDesk desktop application front-end and Electron runtime.
- **What Belongs**: React components, domain models, state stores, CSS stylesheets, and Electron main/preload scripts.
- **What Does NOT Belong**: Direct SQLite binary bindings, backend LLM servers, or raw Node.js API imports in renderer.

### 2.2 `packages/`
- **Purpose**: Reusable monorepo libraries with `@coredesk/*` scope.
- **What Belongs**: `@coredesk/ai-engine` (AI orchestration, prompt registry, validation), `@coredesk/contracts` (runtime Zod contracts and Preload interfaces).

### 2.3 `database/`
- **Purpose**: Canonical persistence schemas, SQL migration files, and maintenance scripts.
- **What Belongs**: Relational SQL schemas, versioned migrations, and status/migrate/backup CLI utilities.

### 2.4 `docs/`
- **Purpose**: Unified single source of truth for all human and AI documentation, compatible with Obsidian.
- **What Belongs**: Modular markdown specifications organized by domain.
- **What Does NOT Belong**: Ephemeral chat transcripts or raw build artifacts.
