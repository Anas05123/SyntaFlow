# AI Agency OS

AI Agency OS is the desktop application built under Project Atlas.

This repository currently contains the approved repository foundation plus
ATLAS-CODE-002 foundation runtime services. Product features are intentionally not
implemented yet.

## Development Status

Architecture Freeze passed on 2026-08-03. This repository is in foundation runtime
setup.

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
```

## Security Foundation

- Renderer has no Node.js integration.
- Context isolation and renderer sandboxing are enabled.
- Preload exposes only a narrow typed `atlas` bridge.
- Navigation and popup creation are restricted.
- A restrictive Content Security Policy is installed.
- Health IPC uses a schema-validated secure IPC registration helper.
- Foundation logs redact common secret fields and values.
- Settings are typed and do not store credentials.
- No secrets or user data belong in this repository.

## Runtime Foundation

ATLAS-CODE-002 adds skeleton services for:

- App data path resolution
- Safe settings
- Structured logging
- Secure IPC registration
- Background jobs
- Database migration running
- Startup health aggregation

SQLite persistence, durable settings storage and product tables are deferred to a
future approved task.

## Documentation

The canonical planning vault is outside this repository:

```text
C:\Users\Anas\Desktop\ATLAS\Project Atlas
```

Mirrored documentation lives in `docs/` for implementation reference.
