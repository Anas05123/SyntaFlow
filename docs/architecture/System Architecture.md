# System Architecture

## Architecture Layers

1. Presentation
2. Application
3. Domain
4. Infrastructure

## Proposed Stack

- Desktop shell: Electron
- Frontend: React and TypeScript
- Local database: SQLite
- Local AI: Ollama
- Source control: Git and GitHub

## Critical Rule

The UI must never access the database, filesystem, deployment providers, or AI providers directly.
