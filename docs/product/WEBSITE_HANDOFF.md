# Syntaflow — Marketing Website & Web Authentication Architecture

> **Status:** IMPLEMENTED & VERIFIED  
> **Last verified:** 2026-09-17  
> **Relevant source areas:** `apps/web/`, `docs/decisions/ADR-013-unified-auth-and-account-portal.md`  
> **Owner domain:** Web Engineering & Growth  

---

## 1. Executive Purpose

This document outlines the architecture, routing, visual foundations, and verification suite for the **Syntaflow Public Website (`https://syntaflow.tech`) and Authenticated Account Portal (`https://app.syntaflow.tech` / `/account`)**.

The web presence features four structurally decoupled environments:
1. Public Marketing Website (`/`, `/pricing`, `/download`, `/docs`, etc.) with animated FlowCanvas pipeline and minimal navigation.
2. Cinematic Auth Shell (`/login`, `/signup`, `/forgot-password`, `/auth/desktop`).
3. Guided 5-Step Onboarding Flow (`/onboarding`).
4. Full Application Account Portal (`/account/*`) with categorized sidebar, device sessions, and downloads.

---

## 2. Product Positioning & Value Proposition

- **Target Audience**: Solo agency principals, creative directors, senior design/technical consultants, and independent specialists running $5k – $100k+ client engagements.
- **Core Headline**: *"The Client-Work Operating Environment."*
- **Sub-headline**: *"Run the complete client relationship—from proposal and onboarding, through scoped execution and milestone review, to final approved delivery—in one unified, high-density desktop workspace."*
- **Tone**: Understated, premium, technical, confident. Speaks directly to craft, operational rigor, and financial autonomy. Rejects bubbly SaaS marketing tropes.

---

## 3. Brand Foundations & Visual Tokens

The website must strictly mirror the CoreDesk desktop visual language:
- **Background**: Deep graphite canvas (`#0B0D0F`).
- **Surfaces**: Dark graphite cards (`#121518`) with hair-line borders (`1px solid rgba(255, 255, 255, 0.08)`).
- **Accents**: CoreDesk Cobalt (`#2563EB`) and Cyan (`#06B6D4`).
- **Typography**: Inter / system sans-serif. Clean tabular numeric styling for metrics.
- **No Candy Gradients**: Avoid multi-colored gradients, neon borders, or 3D cartoon illustrations.

---

## 4. Desktop-Web Authentication & Deep Link Callback Flow (`PLANNED`)

CoreDesk desktop relies on browser-based OAuth/web authentication to keep secret management and web credential entry secure:

```
┌────────────────────────────────┐
│ 1. Desktop CoreDesk App        │
│    Operator clicks "Sign In"   │
└───────────────┬────────────────┘
                │ Opens system browser
                ▼
┌────────────────────────────────┐
│ 2. Web Auth (coredesk.app)     │
│    Browser login / OAuth / SSO │
└───────────────┬────────────────┘
                │ Successful authentication generates signed token
                ▼
┌────────────────────────────────┐
│ 3. Deep Link Desktop Callback  │
│    coredesk://auth/callback    │
│    ?token=SECURE_JWT_TOKEN     │
└───────────────┬────────────────┘
                │ Intercepted by Electron protocol handler
                ▼
┌────────────────────────────────┐
│ 4. Desktop Authenticated       │
│    Token stored in safeStorage │
└────────────────────────────────┘
```

---

## 5. Website Scope & Responsibilities

| Web Responsibility | Desktop Responsibility |
|---|---|
| Product marketing and feature walkthroughs | The actual operating workspace, state store, and local files |
| Native desktop app download links (`.exe`, `.dmg`) | Local offline document drafting and task management |
| Web authentication and session token issuance | Execution of local AI inference via Ollama |
| External guest review portal for clients | Sensitive financial terms and private relationship notes |
| Public documentation and engineering handbook | Local SQLite database persistence |
