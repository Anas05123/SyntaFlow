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

The Document Studio provides a focused, distraction-free environment adhering to the desktop executive paper canvas architecture:
- **Unified Studio Toolbar**: Pinned header with document title, review status chip, visibility badge, version pill (`Working draft vX · submitted vY`), client & project breadcrumb links, live save-state contract indicator (`● All changes saved` / `Unsaved edits`), and primary actions ("Request review" / "Save draft").
- **3-Column Studio Layout**:
  - **Left Outline Panel (`.doc-outline`)**: Numbered section list (`01`, `02`...) with live completion status indicators (completed green dot, dirty amber dot, empty dot), section completion counter (`X/Y written`), live document statistics (Total words, Characters, Reading time, Working version), and keyboard shortcut guidance.
  - **Center Writing Desk Canvas (`.doc-body-col` & `.doc-page`)**: Elevated executive paper sheet (`max-width: 820px`, surface depth elevation, typographic hierarchy) with editorial eyebrow, title, and metadata. Sections support seamless inline editing: clicking any section or paragraph activates the clean inline editor with live word/char counters, <kbd>Ctrl+S</kbd> hotkey, and save/revert controls.
  - **Right Inspector Panel (`.doc-rail`)**: Contextual review intelligence card (displaying recent client feedback quotes such as revision requests), open review request banner with one-click "Open guest preview", private internal operator notes (locked with icon, strictly excluded from client review exports), and primary next-step submission triggers.
- **Preview & Export View (`preview`)**: Paginated paper preview within `.cd-doc-subview`, rendering draft content against selectable templates (`executive`, `modern-studio`, `enterprise`), live template preview selector, portfolio inclusion switch, export toggles, and PDF generation simulator.
- **Version History View (`history`)**: Full chronological list of immutable submitted versions (`DocVersion`) with status chips, decision badges, client comments, and one-click "Guest preview" inspection.
- **Guest Preview Workspace (`guest-preview`)**: First-class, in-app workspace preview (`OwnerGuestPreviewWorkspace`) mounting the unified canonical `GuestReviewSurface` with an owner preview toolbar (`Copy guest link`, `Open externally`, `Refresh`, `Close preview`). Keeps the owner inside CoreDesk rather than launching an external shell.
- **Material Protection**: Fully protected against wallpaper bleed under `:root[data-wallpaper]`, enforcing solid background opacity, backdrop blur, and crisp contrast across all three panels and canvas sheets.

---

## 4. Presentation Templates & Studio Portfolio Integration

To project agency authority, documents and review packages support three distinct presentation templates:

1. **Executive Editorial (`executive`)**:
   - **Aesthetic**: Traditional bespoke publishing and executive board deck.
   - **Typography**: Editorial serif headings (`Cormorant Garamond` / `Georgia`), high-legibility sans body (`Inter`), warm ivory reading sheet background (`#FCFBF7` / `#16191D`).
   - **Accents**: Subtle golden seal badges, understated thin horizontal rules, centered masthead layout.
2. **Modern Studio Showcase (`modern-studio`)**:
   - **Aesthetic**: High-end minimalist design atelier and architecture monograph.
   - **Typography**: Crisp grotesque typography (`Inter Display` / `Helvetica Neue`), tight letter-spacing, stark monochrome contrast.
   - **Accents**: Monospace classification tags (`[PROPOSAL // v1.0]`), geometric framing, clean left-aligned grid hierarchy.
3. **Enterprise Formal (`enterprise`)**:
   - **Aesthetic**: Institutional governance, audited technical report, and management consultancy memo.
   - **Typography**: Technical grotesques (`IBM Plex Sans` / `Roboto`), structured metadata grids.
   - **Accents**: Security clearance watermarks, numbered paragraph ledgers, formal audit trail and compliance sign-off blocks.

### 4.1 Studio Portfolio Showcase (`portfolio.ts`)
Documents and reviews can optionally bind Northlight Studio's canonical portfolio showcase:
- **Case Studies**: Harbor & Finch (Luxury retail identity), Verity Health (Digital patient intake), and Atlas Logistics (Real-time telemetry platform).
- **Executive Metrics**: Measurable impact statistics (+38% brand recognition, 5.4M intake users, <200ms latency).
- **Client Endorsements**: Verifiable quotes and testimonials from client leadership (Marta Velasco, Dr. Aris Thorne, Kaelen Vance).

---

## 5. PDF Generation Architecture (`PLANNED`)

Currently, clicking "Export PDF" opens a simulated export modal. The planned production implementation:
1. React renderer calls `window.coreDeskDesktop.document.exportPdf(documentId, version)`.
2. Main process creates a hidden background `BrowserWindow` with clean print CSS.
3. Renders the frozen `DocVersion` snapshot.
4. Executes `win.webContents.printToPDF({ marginsType: 1, printBackground: true })`.
5. Prompts operator with native OS save dialog and saves binary PDF to disk.
