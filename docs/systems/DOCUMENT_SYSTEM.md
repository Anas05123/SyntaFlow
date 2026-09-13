# CoreDesk — Document Studio & Versioning System

> **Status:** IMPLEMENTED (Editor, Snapshot Architecture, Preview) / PDF Generation `PLANNED`  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `coredesk-app/src/screens/DocumentWorkspaceScreen.tsx`, `coredesk-app/src/screens/DocumentsScreen.tsx`, `coredesk-app/src/domain/types.ts`  
> **Owner domain:** Document Engineering & Governance  

---

## 1. Document Types & Purpose

A `DocumentRecord` in CoreDesk represents a formal, versioned work artifact created during client engagements. CoreDesk recognizes seven canonical document types:
1. **Proposal**: Commercial offer detailing problem, approach, timeline, and fee structure.
2. **Brief**: Project goals, requirements, constraints, and stakeholder criteria.
3. **Agreement record**: Legally binding commercial scope, payment milestones, and terms.
4. **Welcome pack**: Client onboarding instructions, contacts, tooling links, and expectations.
5. **Scope / Report**: Formal technical specification, audit findings, or architecture overview.
6. **Notes**: Internal or shared working notes, meeting summaries, and interview transcripts.
7. **Deliverable**: Final digital asset or report produced for milestone sign-off.

---

## 2. Working Version vs. Submitted Version Semantics

The distinction between active drafting and formal client submission is an architectural foundation:

```
[ Working Version (Draft) ]  ────────►  [ Submit for Review ]
      │                                       │
      ▼                                       ▼
  - Mutable draft                        - Creates immutable DocVersion snapshot (v1)
  - Editable sections                    - Locks snapshot content & author
  - Internal operator notes              - reviewState transitions to 'waiting'
  - Local auto-save                      - Exposes version to Guest Review Portal
```

### 2.1 The Working Version (`workingVersion`)
- The active, mutable draft currently open in the Document Studio editor.
- The operator can freely edit section text, reorder sections, and adjust internal notes.
- Edits to the working draft **never mutate previously submitted snapshots**.

### 2.2 The Submitted Version (`submittedVersion` / `DocVersion`)
- When the operator clicks "Submit for Review", the system freezes the current working version into an immutable `DocVersion` snapshot ($n$).
- The snapshot captures: `n`, `author`, `date`, `sections: string[]`, `decision: null`, and `note`.
- Once created, a `DocVersion` cannot be modified by either the operator or the client.
- If the client requests revisions, the working draft version is incremented ($n+1$), allowing the operator to implement feedback without destroying the audit record of version $n$.

---

## 3. Document Studio Interface (`DocumentWorkspaceScreen.tsx`)

The Document Studio provides a focused, distraction-free environment with four integrated views:
- **Header**: Document title, client & project breadcrumb badges, version metadata (`working vX · submitted vY`), review status indicator, and primary actions ("Submit for Review", "Export PDF", "Request Review").
- **Write View (`editor`)**: Multi-section markdown/plain-text editor with section outline, live save-state contract indicators (`saved`, `dirty`, `saving`, `failed`), and private operator notes (strictly excluded from guest access).
- **Preview & Export View (`preview`)**: Paginated print preview simulating page breaks and layout for client PDF export.
- **Version History View (`history`)**: Full chronological list of immutable submitted versions (`DocVersion`) with status chips, decision badges, client comments, and one-click "Guest preview" inspection.
- **Guest Preview Workspace (`guest-preview`)**: First-class, in-app workspace preview (`OwnerGuestPreviewWorkspace`) mounting the unified canonical `GuestReviewSurface` with an owner preview toolbar (`Copy guest link`, `Open externally`, `Refresh`, `Close preview`). Keeps the owner inside CoreDesk rather than launching an external shell.
- **Side Panel (Metadata & Actions)**: Shows document properties, linked project milestone, open review requests with direct "Open guest preview" action, and client feedback.

---

## 4. PDF Generation Architecture (`PLANNED`)

Currently, clicking "Export PDF" opens a simulated export modal. The planned production implementation:
1. React renderer calls `window.coreDeskDesktop.document.exportPdf(documentId, version)`.
2. Main process creates a hidden background `BrowserWindow` with clean print CSS.
3. Renders the frozen `DocVersion` snapshot.
4. Executes `win.webContents.printToPDF({ marginsType: 1, printBackground: true })`.
5. Prompts operator with native OS save dialog and saves binary PDF to disk.
