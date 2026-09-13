# ADR-002: SQLite as Canonical Local Persistence Store

> **Date:** 2026-08-03  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Data must be completely owned by the solo principal on their physical machine, supporting transactional integrity and instant search.

## Decision
Adopt SQLite (via local file database) as the single source of truth for all operational records, clients, projects, tasks, and document metadata.

## Consequences
Requires disciplined schema migrations and transactional write operations in the main process.
