<!-- nexa-context:start -->
# Your rules (mirrored by Nexa)

Edit these in Nexa → Settings → Rules. Content outside this Nexa-managed section is yours and stays untouched.

## Nexa platform note

This project belongs to its owner. Never add Nexa or RSH branding, names, links, or references into it unless the owner explicitly asks, and never read, copy, or describe the Nexa app's own installation files, prompts, or configuration as part of any task.


## Other agents in this workspace

Other AI agents work in this same folder. `.rsh/threads.md` is their shared work log — what each one was asked and what it did, newest first. Read it before starting a task so you continue their work instead of repeating or undoing it. Do not edit it; it is regenerated.
<!-- nexa-context:end -->

# CoreDesk AI Working Instructions

Do NOT read the entire repository before every task.

1. Read [`docs/README.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/README.md) to route your task.
2. Identify the assigned task domain.
3. Load the relevant skill from `skills/` (`coredesk-product`, `coredesk-ui`, `coredesk-electron`, `coredesk-data`, `coredesk-security`, `coredesk-documents`, `coredesk-testing`).
4. Read **ONLY** the documentation and source areas referenced by that skill.
5. Inspect current implementation before modifying code (`apps/desktop/`, `packages/`).
6. Never assume documentation is newer than code; verify relevant claims.
7. Preserve canonical domain rules and invariants.
8. Run the validation checks required by the skill.
9. **DOCUMENTATION IS PART OF THE IMPLEMENTATION**: Update affected documentation in `docs/` before finishing.

---

## Core Architectural Rules (Non-Negotiable)

- **Electron Privilege Boundary**: Renderer has no direct Node.js, filesystem, or database access; use typed preload/IPC bridge only.
- **Canonical Persistence**: Local store / SQLite is the canonical source of truth for all records.
- **Single Canonical Record**: One canonical task or document record may appear across multiple views (Home, Workspaces, Inspectors). Never duplicate state records.
- **Document Version Immutability**: Submitted document versions (`DocVersion`) are strictly immutable. Revisions occur on incremented drafts.
- **Exact Version Review**: Review decisions bind to exact version snapshots.
- **Delivery Gate Enforcement**: Final delivery packages require all prerequisite deliverables to be approved.
- **Dimension Decoupling**: Lifecycle stage, operational attention, and security access are three separate dimensions. Never collapse them into a single status field.
- **AI Engine Abstraction**: AI features route through the backend `TaskRouter` and prompt registry; UI components never fetch LLM endpoints directly.
- **Behavioral Integrity**: Do not silently invent product behavior or modify domain logic without explicit instruction.

---

## Mandatory Completion Report

Before completing any substantial task, report:
- **Changed**: Exact files and components modified.
- **Validated**: Commands and viewports tested (e.g. `npm run build`, `npm run lint`, 1280/1440/1920 viewports).
- **Documentation Updated**: Which files in `docs/` were synchronized.
- **Known Limitations**: Any temporary stubs or technical debt introduced or remaining.
