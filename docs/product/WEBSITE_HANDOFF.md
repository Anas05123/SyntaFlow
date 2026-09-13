# CoreDesk — Marketing Website & Web Authentication Handoff

> **Status:** SPECIFIED & PLANNED FOR FUTURE WEB AGENT  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `docs/coredesk/PRODUCT_VISION.md`, `docs/coredesk/DESIGN_SYSTEM.md`  
> **Owner domain:** Web Engineering & Growth  

---

## 1. Executive Purpose

This document serves as the standalone architectural handoff for a future AI agent tasked with designing and building the **CoreDesk Marketing Website, Documentation Hub, and Web Authentication Portal** (`https://coredesk.app`).

An AI reading this document can build the web presence without needing to inspect desktop application source code.

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
