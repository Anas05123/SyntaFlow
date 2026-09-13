# ADR-007: Decoupled Status, Attention, and Security Dimensions

> **Date:** 2026-08-12  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Conflating production progress with attention states creates confusing boards and muddles commercial reality.

## Decision
Lifecycle Stage (Draft/Active/Delivered), Operational Attention (Waiting/Blocked/Overdue), and Access Grants are three separate dimensions. Status Board strictly reflects To Do, In Progress, and Done.

## Consequences
Clean separation of concerns; attention flags overlay status without mutating the production column.
