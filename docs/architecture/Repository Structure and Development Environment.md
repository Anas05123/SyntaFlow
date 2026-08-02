---
title: Repository Structure and Development Environment
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Approved Foundation
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Repository Structure and Development Environment

## Purpose

This document defines the official repository structure, development tools, environment setup, configuration rules and validation process for AI Agency OS.

Codex must follow this structure instead of inventing a new one.

## Repository Strategy

AI Agency OS uses one Git repository with a small `pnpm` workspace.

It is a modular monolith, not a microservices system.

The repository contains:

- One Electron desktop application.
- Internal shared packages.
- Project documentation.
- Prompt files.
- Database migrations.
- Build and maintenance scripts.

## Approved Development Foundation

| Area              | Decision                                         |
| ----------------- | ------------------------------------------------ |
| Runtime           | Supported Node.js LTS                            |
| Package Manager   | pnpm                                             |
| Desktop Framework | Electron                                         |
| Build Foundation  | Electron Forge with Vite                         |
| Frontend          | React                                            |
| Language          | TypeScript                                       |
| Styling           | Tailwind CSS                                     |
| UI Foundation     | Internal component library inspired by shadcn/ui |
| State             | Zustand for local UI state                       |
| Validation        | Zod                                              |
| Database          | SQLite                                           |
| AI Runtime        | Ollama                                           |
| Tests             | Vitest and Playwright                            |
| Linting           | ESLint                                           |
| Formatting        | Prettier                                         |
| Documentation     | Obsidian Markdown                                |

## Root Repository Structure

```text
project-atlas/
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”œâ”€â”€ .vscode/
â”œâ”€â”€ apps/
â”‚   â””â”€â”€ desktop/
â”‚       â”œâ”€â”€ src/
â”‚       â”‚   â”œâ”€â”€ main/
â”‚       â”‚   â”œâ”€â”€ preload/
â”‚       â”‚   â”œâ”€â”€ renderer/
â”‚       â”‚   â”œâ”€â”€ core/
â”‚       â”‚   â”œâ”€â”€ modules/
â”‚       â”‚   â”œâ”€â”€ providers/
â”‚       â”‚   â”œâ”€â”€ plugins/
â”‚       â”‚   â””â”€â”€ shared/
â”‚       â”œâ”€â”€ resources/
â”‚       â”œâ”€â”€ forge.config.ts
â”‚       â””â”€â”€ package.json
â”œâ”€â”€ packages/
â”‚   â”œâ”€â”€ contracts/
â”‚   â”œâ”€â”€ design-system/
â”‚   â”œâ”€â”€ testing/
â”‚   â””â”€â”€ configuration/
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ handbook/
â”‚   â”œâ”€â”€ architecture/
â”‚   â”œâ”€â”€ decisions/
â”‚   â”œâ”€â”€ modules/
â”‚   â””â”€â”€ codex-tasks/
â”œâ”€â”€ prompts/
â”œâ”€â”€ migrations/
â”œâ”€â”€ scripts/
â”œâ”€â”€ tests/
â”œâ”€â”€ tools/
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â”œâ”€â”€ package.json
â”œâ”€â”€ pnpm-workspace.yaml
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ README.md
â””â”€â”€ tsconfig.base.json
```

## Desktop Application Structure

```text
apps/desktop/src/
â”œâ”€â”€ main/
â”‚   â”œâ”€â”€ lifecycle/
â”‚   â”œâ”€â”€ windows/
â”‚   â”œâ”€â”€ ipc/
â”‚   â”œâ”€â”€ security/
â”‚   â””â”€â”€ index.ts
â”œâ”€â”€ preload/
â”‚   â”œâ”€â”€ bridges/
â”‚   â”œâ”€â”€ contracts/
â”‚   â””â”€â”€ index.ts
â”œâ”€â”€ renderer/
â”‚   â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ layouts/
â”‚   â”œâ”€â”€ routes/
â”‚   â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ hooks/
â”‚   â”œâ”€â”€ state/
â”‚   â”œâ”€â”€ styles/
â”‚   â””â”€â”€ main.tsx
â”œâ”€â”€ core/
â”‚   â”œâ”€â”€ database/
â”‚   â”œâ”€â”€ filesystem/
â”‚   â”œâ”€â”€ jobs/
â”‚   â”œâ”€â”€ settings/
â”‚   â”œâ”€â”€ security/
â”‚   â”œâ”€â”€ audit/
â”‚   â”œâ”€â”€ logging/
â”‚   â””â”€â”€ notifications/
â”œâ”€â”€ modules/
â”‚   â”œâ”€â”€ campaigns/
â”‚   â”œâ”€â”€ businesses/
â”‚   â”œâ”€â”€ discovery/
â”‚   â”œâ”€â”€ enrichment/
â”‚   â”œâ”€â”€ atlas/
â”‚   â”œâ”€â”€ website-projects/
â”‚   â”œâ”€â”€ website-generator/
â”‚   â”œâ”€â”€ templates/
â”‚   â”œâ”€â”€ crm/
â”‚   â”œâ”€â”€ outreach/
â”‚   â”œâ”€â”€ deployment/
â”‚   â””â”€â”€ backup/
â”œâ”€â”€ providers/
â”‚   â”œâ”€â”€ ai/
â”‚   â”œâ”€â”€ discovery/
â”‚   â””â”€â”€ deployment/
â”œâ”€â”€ plugins/
â””â”€â”€ shared/
```

## Process Boundaries

### Main Process

Owns lifecycle, windows, secure IPC, database, filesystem, jobs, credentials, provider integrations and security controls.

### Preload Process

Exposes narrow typed APIs. It contains no business logic and no unrestricted Electron or Node access.

### Renderer Process

Owns React UI, user interaction and local UI state. It cannot access SQLite, filesystem, Ollama, shell commands or credentials directly.

### Worker Processes

Handle long-running tasks such as discovery, enrichment, AI generation, website compilation, deployment, embeddings and backups.

## Internal Packages

### `packages/contracts`

Contains stable shared contracts between main, preload, renderer, workers and packages.

Must not contain database implementations, React components, provider SDK objects or secrets.

### `packages/design-system`

Contains design tokens, theme configuration, UI primitives, accessibility helpers and reusable components.

### `packages/testing`

Contains fake providers, test factories, temporary database helpers and fixtures.

### `packages/configuration`

Contains shared TypeScript, ESLint, Prettier and build configuration helpers.

## Environment Variables

`.env.example` may include:

```env
APP_ENV=development
LOG_LEVEL=debug
OLLAMA_BASE_URL=http://127.0.0.1:11434
DATABASE_PATH=
PROJECT_DATA_PATH=
```

Rules:

- `.env` is never committed.
- `.env.example` contains no real secrets.
- Production credentials use Secure Storage.
- Renderer code must not receive secret environment variables.
- Unknown environment values must be rejected.

## Local Application Data

Development data remains outside the source repository.

```text
Documents/
â””â”€â”€ Project Atlas Development Data/
    â”œâ”€â”€ database/
    â”œâ”€â”€ projects/
    â”œâ”€â”€ assets/
    â”œâ”€â”€ backups/
    â”œâ”€â”€ logs/
    â”œâ”€â”€ cache/
    â””â”€â”€ temporary/
```

User data must never be stored inside the application repository.

## Database Migrations

```text
migrations/
â”œâ”€â”€ 0001_initial_schema.sql
â”œâ”€â”€ 0002_campaign_indexes.sql
â””â”€â”€ metadata.json
```

Rules:

- Migrations are versioned.
- Released migrations are never edited.
- Fixes require new migrations.
- Destructive migrations require backup and review.
- Tests run migrations from a clean database.

## Prompt Structure

```text
prompts/
â””â”€â”€ websites/
    â””â”€â”€ brief/
        â”œâ”€â”€ v1.md
        â”œâ”€â”€ schema.json
        â”œâ”€â”€ examples/
        â””â”€â”€ evaluation/
```

Prompts are versioned and never hard-coded inside UI components.

## Required Tools

- Git
- Node.js LTS
- pnpm
- Visual Studio Code
- Ollama
- Obsidian
- GitHub account

Docker is not required for normal Version 1 development.

## Root Scripts

```json
{
  "scripts": {
    "dev": "pnpm --filter @atlas/desktop dev",
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm -r lint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "pnpm -r test",
    "test:e2e": "playwright test",
    "test:security": "vitest run tests/security",
    "validate": "pnpm typecheck && pnpm lint && pnpm format:check && pnpm test",
    "db:migrate": "node scripts/database/migrate.mjs",
    "db:backup": "node scripts/database/backup.mjs"
  }
}
```

## Generated Website Workspaces

Generated client websites are separate from the main app repository.

```text
application-data/
â””â”€â”€ projects/
    â””â”€â”€ websites/
        â””â”€â”€ <project-id>/
            â”œâ”€â”€ specification/
            â”œâ”€â”€ source/
            â”œâ”€â”€ assets/
            â”œâ”€â”€ builds/
            â”œâ”€â”€ previews/
            â””â”€â”€ versions/
```

Generated projects are treated as untrusted until validated.

## Git Ignore Foundation

```gitignore
node_modules/
dist/
out/
coverage/
playwright-report/
test-results/
.env
.env.*
!.env.example
*.log
*.sqlite
*.sqlite-wal
*.sqlite-shm
temporary/
cache/
.DS_Store
Thumbs.db
```

## Repository Initialization Order

1. Git repository
2. pnpm workspace
3. TypeScript configuration
4. ESLint and Prettier
5. Electron desktop shell
6. React renderer
7. Secure preload bridge
8. Shared contracts
9. Testing foundation
10. CI validation
11. Logging foundation
12. Database migration runner
13. Settings foundation
14. Job Service foundation

Feature modules begin only after foundation validation passes.

## Local Validation

Minimum completion commands:

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
```

For UI or full-system changes:

```powershell
pnpm test:e2e
pnpm build
```

## Architecture Decisions

### ADR-ENV-001 - pnpm Workspace

**Decision:** Use a small pnpm workspace.

**Reason:** It supports internal packages without requiring a complex monorepo framework.

### ADR-ENV-002 - Electron Forge with Vite

**Decision:** Use Electron Forge with Vite.

**Reason:** It provides a practical desktop development and packaging path.

### ADR-ENV-003 - Separate Generated Projects

**Decision:** Generated websites remain outside the application repository.

**Reason:** Generated and untrusted projects must not contaminate the core codebase.

### ADR-ENV-004 - No Docker Requirement

**Decision:** Docker is not required for normal Version 1 development.

**Reason:** The product should remain easy to develop locally on Windows.

## Acceptance Criteria

- [ ] Repository uses approved pnpm workspace.
- [ ] Main, preload and renderer code are separated.
- [ ] Renderer has no privileged direct access.
- [ ] User data remains outside the repository.
- [ ] Migrations are versioned.
- [ ] Prompts are versioned.
- [ ] Generated websites use isolated directories.
- [ ] Root validation commands exist.
- [ ] Secrets and user data are ignored by Git.

## Next Action

Use [[Testing and Quality Assurance Strategy]] to define the validation gates.
