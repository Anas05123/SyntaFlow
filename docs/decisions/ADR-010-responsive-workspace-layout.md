# ADR-010: Workspace-Width Responsive Inspector Layout

> **Date:** 2026-09-12  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Relying solely on viewport width media queries broke layout when sidebars collapsed or expanded on ultra-wide screens.

## Decision
Use ResizeObserver measuring available workspace container width (>= 1020px) to switch between side-by-side split and overlay drawer modes.

## Consequences
Robust responsive behavior regardless of sidebar toggle state.
