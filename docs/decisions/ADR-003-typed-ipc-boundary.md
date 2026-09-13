# ADR-003: Narrow, Typed IPC Preload Boundary

> **Date:** 2026-08-05  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Direct Node.js or filesystem access from the renderer exposes the system to remote execution risks and breaks privilege isolation.

## Decision
Renderer is completely sandboxed with contextIsolation enabled. All communication occurs over explicit, typed IPC channels defined in @coredesk/contracts.

## Consequences
All new data mutations require IPC handler registration and schema validation.
