# CoreDesk — Product Vision & Philosophy

> **Status:** IMPLEMENTED (Foundational Product Baseline)  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `CoreDesk-Product-Context.md`, `coredesk-app/src/domain/types.ts`  
> **Owner domain:** Product Strategy  

---

## 1. Executive Summary & Purpose

**CoreDesk** is a desktop-first client-work operating environment designed specifically for boutique agencies, creative studios, and independent operators (solo principals, senior freelancers, specialist consultants).

It unifies the entire commercial and operational lifecycle of professional client engagements—from initial lead and proposal, through agreement, onboarding, active project delivery, milestone reviews, and final artifact delivery—into a single persistent desktop workspace.

---

## 2. The Core Problem

In independent consulting and creative client work, the execution of the craft is rarely the primary failure mode; **the bookkeeping of the work is the failure mode.**

Today, an operator's practice is scattered across disconnected tools:
- The proposal lives in PandaDoc or Google Docs.
- The brief is in Notion or Figma.
- The working file versions are across local folders, Dropbox, or Drive.
- The approval feedback is buried in an email thread or Slack DM.
- The delivery link is sent in a transient chat message.

**Six months later, nobody can definitively answer:**
> *"Which exact version did the client approve, what scope boundaries did they sign off on, and what files did we actually hand over?"*

CoreDesk solves this by ensuring that this question **always has one unambiguous answer, in one place, backed by immutable audit history.**

---

## 3. Product Philosophy & Organizing Beliefs

### Belief 1: The Product is the Loop, Not the Screens
CoreDesk is not a collection of isolated productivity gadgets. **A complete client-work loop is the product.** V1 is not judged by how many standalone screens exist, but by whether an operator can complete an entire client engagement from first proposal to final signed delivery without context scattering across third-party tools.

### Belief 2: Context is a First-Class Citizen
Traditional tools store documents and tasks, but discard the relational tissue connecting them. In CoreDesk, every entity maintains strict relational provenance:
$$\text{Workspace} \longrightarrow \text{Client} \longrightarrow \text{Project} \longrightarrow (\text{Milestone} \mid \text{Task} \mid \text{Document} \mid \text{Delivery})$$
A task or document displayed without clear ownership (which client, which project, which commercial boundary) is considered an architectural failure.

### Belief 3: The Three Structural Records
Three concepts that appear deceptively similar in generic tools are strictly decoupled in CoreDesk:
1. **CLIENT** — The ongoing commercial relationship that outlives any individual project engagement.
2. **PROJECT** — A discrete, scoped engagement with defined outcomes, budgets, and milestones.
3. **DOCUMENT** — A versioned, reviewable, and deliverable work artifact.

**Non-negotiable UI and Domain Invariants:**
- Completing or archiving a Project **never** archives the Client.
- Archiving a Client requires all active Projects to be resolved or explicitly handled.
- Deleting or closing a Project never deletes the relationship history attached to the Client.
- No single project stage may ever substitute for the overall health of the client relationship.

---

## 4. Target User & Positioning

### Primary User Persona (V1)
- **The Solo Agency Principal / Independent Operator**: Senior practitioners (designers, architects, software engineers, brand strategists, executive advisors) running high-value engagements ($5k – $100k+).
- They operate their own business, value high-density desktop interfaces, reject SaaS subscription traps, demand offline-first speed, and require rock-solid commercial auditability.

### Guest User Persona (V1)
- **The Client Stakeholder / Decision-Maker**: External enterprise buyers, CMOs, or founders who access a focused, quiet, invite-only web/guest review surface to inspect proposals, approve deliverables, and download completed delivery packages.

### Positioning
CoreDesk is positioned as **an executive operating cockpit**, sitting above raw creative tools (Figma, VS Code, Blender) and replacing generic SaaS project management tools (Asana, Monday, ClickUp) with a specialized client-relationship operating environment.

---

## 5. What CoreDesk Is vs. What CoreDesk Is Not

| What CoreDesk IS | What CoreDesk IS NOT |
|---|---|
| A desktop-first client operating environment | A generic CRM with sales funnels and lead scrapers |
| A high-density desktop cockpit with instant 1-click execution | A generic web SaaS dashboard filled with vanity KPI cards |
| An immutable review and delivery audit trail | A Notion or Trello clone for arbitrary personal note-taking |
| An offline-first, local-first professional workspace | A cloud-only subscription lock-in application |
| A structured blueprint engine for client scoping | An IDE, code editor, or raw design canvas |
| A privacy-first local AI assistant using Ollama | A chat-first wrapper with a sidebar full of LLM bots |

---

## 6. The Five Acceptance Gates of V1

To be considered complete and reliable, CoreDesk enforces five strict validation gates:

1. **First Meaningful Work**: An operator creates a Client, a Project, and their first Task in $\le 5$ minutes unaided. The task appears as a single canonical record across Home, Tasks Workspace, and Project Workspace.
2. **Review & Revision Integrity**: Version 1 is submitted, changes are requested by the client, and Version 2 is approved. Version 1 content, stakeholder comments, and decision timestamps remain fully readable and immutable.
3. **Access Isolation**: Guest reviewer for Client A cannot reach Client B by navigation, global search, or direct link.
4. **Delivery Correctness**: A delivery package contains the *exact approved versions*; unapproved required work blocks final package assembly.
5. **Recovery & History**: Save, upload, or network failures retain input without data loss; rapid repeated clicks never duplicate events; archiving preserves all relational links.

---

## 7. Product Principles

1. **Offline-First & Local Sovereignty**: The operator owns their data. CoreDesk operates fully offline on the desktop.
2. **Desktop Density**: Interfaces prioritize information density, tabular numeric alignment, and keyboard command velocity (`⌘K`).
3. **Restrained Aesthetic**: Dark graphite surfaces (`#0B0D0F`), subtle 1px structural edges, CoreDesk cobalt (`#2563EB`) and cyan (`#06B6D4`) accents. No pastel candy cards, no neon borders, no gratuitous animations.
4. **Dimension Decoupling**: Lifecycle stage, operational attention, and security access are three orthogonal dimensions that must never be collapsed into a single status string.
