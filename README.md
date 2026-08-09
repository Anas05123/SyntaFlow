# AI Agency OS

AI Agency OS is the desktop application built under Project Atlas.

This repository currently contains the approved repository foundation,
ATLAS-CODE-002 foundation runtime services and ATLAS-CODE-003 database/settings
persistence. Product features are intentionally not implemented yet.

## Development Status

Architecture Freeze passed on 2026-08-03. This repository is in foundation
runtime setup.

## Requirements

- Git
- Node.js LTS
- pnpm
- Obsidian for the planning vault
- Ollama later, when AI runtime tasks begin

## Setup

```powershell
pnpm install
pnpm validate
pnpm dev
```

## Commands

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm validate
pnpm db:status
pnpm db:migrate
pnpm db:backup
```

## Security Foundation

- Renderer has no Node.js integration.
- Context isolation and renderer sandboxing are enabled.
- Preload exposes only a narrow typed `atlas` bridge.
- Navigation and popup creation are restricted.
- A restrictive Content Security Policy is installed.
- Health IPC uses a schema-validated secure IPC registration helper.
- Foundation logs redact common secret fields and values.
- Settings are typed, persisted locally and do not store credentials.
- No secrets or user data belong in this repository.

## Runtime Foundation

ATLAS-CODE-002 adds services for:

- App data path resolution
- Structured logging
- Secure IPC registration
- Background jobs
- Startup health aggregation

ATLAS-CODE-003 adds:

- SQLite-compatible local database persistence through the isolated database
  adapter.
- Foundation-only tables: `schema_migrations`, `foundation_metadata` and
  `app_settings`.
- Versioned migration metadata.
- Backup-before-migration hooks.
- Safe settings persistence for non-sensitive settings.
- Database status, migration and backup scripts.
- Integration tests using isolated temporary databases.

No campaigns, businesses, CRM, AI, discovery, website, deployment or plugin
product schema exists yet.

## Database Scripts

Database scripts use a safe development data directory by default:

```text
Documents\Project Atlas Development Data\ai-agency-os-development
```

When `CI=true`, scripts use an isolated temporary directory instead. Override the
location with `PROJECT_ATLAS_DATA_PATH` when needed.

```powershell
pnpm db:status
pnpm db:migrate
pnpm db:backup
```

The scripts print JSON output and do not touch production user data.

## Documentation

The canonical planning vault is outside this repository:

```text
C:\Users\Anas\Desktop\ATLAS\Project Atlas
```

Mirrored documentation lives in `docs/` for implementation reference.
