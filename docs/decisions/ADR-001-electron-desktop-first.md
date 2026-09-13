# ADR-001: Desktop-First Architecture via Electron

> **Date:** 2026-08-03  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Operators require complete offline independence, zero third-party cloud lock-in, native frameless windows, local file sovereignty, and predictable UI rendering.

## Decision
Develop CoreDesk as a desktop-first Electron application with sandboxed BrowserWindow, typed preload bridge, and local React renderer.

## Consequences
Bundle includes Chromium/Node runtimes; requires strict security sandboxing to prevent renderer privilege escalation.
