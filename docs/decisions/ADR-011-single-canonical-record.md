# ADR-011: Single Canonical Record Across All Views

> **Date:** 2026-09-11  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Multiple copies of task or client records across views caused state drift and out-of-sync indicators.

## Decision
Every entity exists as exactly one canonical record in state. Home Focus Queue, Tasks Board, List View, and Inspectors render projections of this single record.

## Consequences
Zero synchronization bugs; instantaneous updates across all open views.
