# Syntaflow

> **Intelligence in Flow.**  
> Syntaflow is an intelligent operating environment for connected work. It connects context, people, tools, documents, reviews, and delivery into a calm, continuous workspace.

---

## 1. Repository Structure

```
CoreDesk/
├── apps/
│   ├── desktop/             # Canonical Electron + React desktop application
│   └── web/                 # Reserved boundary for future marketing & auth portal
│
├── packages/
│   ├── ai-engine/           # @coredesk/ai-engine (local-first Ollama runtime & TaskRouter)
│   └── contracts/           # @coredesk/contracts (typed schemas & IPC contracts)
│
├── database/
│   ├── migrations/          # SQLite schema versions & migration files
│   └── scripts/             # Migration, backup, and status runner utilities
│
├── docs/                    # Unified documentation & native Obsidian knowledge vault
│   ├── README.md            # Master documentation router for developers and AI agents
│   ├── 00-start-here/       # CoreDesk Home, Development Status, and Documentation Map
│   ├── product/             # Vision, commercial lifecycle, and domain invariants
│   ├── architecture/        # System, Electron, data model, and coding standards
│   ├── systems/             # Task, document, review/delivery, and appearance engines
│   ├── design/              # UI/UX guidelines and dark graphite design system
│   ├── security/            # Threat model, sandboxing, and access grants
│   ├── roadmap/             # Phase planning and known issues
│   ├── decisions/           # Architecture Decision Records (ADRs)
│   ├── research/            # Operational research briefs and product context
│   ├── migration/           # Consolidation audit logs and migration reports
│   └── archive/             # Historical project notes and legacy prototypes
│
├── skills/                  # Modular AI agent context routers
├── assets/
│   ├── brand/               # Official logos, icon marks, and brand guidelines
│   └── design/              # Figma provenance, slices, and design JSON exports
│
└── tools/
    ├── brand/               # Vector mark generator and rendering scripts
    ├── frame-analysis/      # Video extraction and layout measurement utilities
    └── launch/              # Standalone executable and launch scripts
```

---

## 2. Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v9+) or `npm`

### Running the Desktop Application
To launch the desktop application directly in Electron:

```bash
# Using the root launcher script (Windows)
Launch-CoreDesk.bat

# Or using package commands
npm run desktop
```

### Development Mode (Vite Hot-Reload)
To run the renderer with Vite hot module replacement:

```bash
cd apps/desktop
npm run dev
```

### Production Build & Linting
```bash
cd apps/desktop
npm run build
npm run lint
```

### Route & Interaction Verification
To run the full 33-route headless verification suite using Playwright:

```bash
node apps/desktop/verify-app.mjs
```

---

## 3. Architecture Invariants

1. **Electron Privilege Boundary**: The renderer process has zero direct access to Node.js, the local filesystem, or the SQLite database. All operations traverse a strictly typed IPC preload bridge (`@coredesk/contracts`).
2. **Local-First Canonical Persistence**: SQLite is the canonical single source of truth for all operational records. Data belongs strictly to the user on their physical machine.
3. **Single Canonical Record**: One canonical task or document record exists in memory. Home, Project Workspaces, and Boards render projections of this single record.
4. **Immutable Document Snapshots**: Submitted documents (`DocVersion`) are strictly immutable. Further revisions occur only on incremented working drafts.
5. **Decoupled 3D Status**: Production stage (`To Do`, `In Progress`, `Done`), operational attention (`Waiting`, `Blocked`, `Overdue`), and security access are separate dimensions.

---

## 4. Documentation & AI Workflow

- **For Humans**: Open `docs/` in [Obsidian](https://obsidian.md) to explore the knowledge graph, starting from [`docs/00-start-here/CoreDesk Home.md`](docs/00-start-here/CoreDesk%20Home.md).
- **For AI Agents**: AI coding agents must read [`AGENTS.md`](AGENTS.md) and route their context through [`docs/README.md`](docs/README.md) rather than scanning the entire repository.
