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

The website features an editorial modular visual system that feels premium, alive, friendly, human-designed, and confident:
- **Base Surfaces & Light Canvas**: Warm/cool off-white background (`#F7F9FD`) paired with crisp white paper-cards (`#FFFFFF`).
- **Deep Navy Contrast Stages**: High-impact contrast containers (`#0C1220`) for interactive simulators, terminal previews, and technical showcases.
- **Accents**: Cobalt (`#2F6BFA`) for primary intent, Cyan (`#29C4E8`) for live activity, Mint (`#5ED6A6`) for gates/success, Amber (`#F5B842`) for review attention, and Coral (`#F06D66`) for blockers.
- **Typography & Geometry**: Sora geometric display typography for headings, Inter for high-legibility body, tactile 14px buttons (`--radius-button: 14px`), and 20px card rounding (`--radius-card: 20px`).
- **No AI Clichés or Candy Glow**: 85–90% neutral balance; zero fake automation badges, floating orbs, or generic neon templates.

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
