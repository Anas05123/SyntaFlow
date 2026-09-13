# ADR-012: Modular AI Knowledge Architecture & Living Documentation

> **Date:** 2026-09-13  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Large monolithic documentation files overload AI agent context windows and drift out of sync with code.

## Decision
Organize docs into discrete modular files with freshness headers, map domains via AGENTS.md and specialized skills, and make doc updates a non-negotiable definition of done.

## Consequences
Agents load only 1-2 relevant files per task; knowledge remains durable and synchronized.
