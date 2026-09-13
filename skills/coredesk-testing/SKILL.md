---
name: coredesk-testing
description: Use for CoreDesk test harnesses, Playwright E2E verification, responsive viewport checks, and QA validation.
---

# CoreDesk Quality Assurance & Testing Skill

## Purpose
Use when writing new test specs, running regression suites, validating responsive viewport behavior, or diagnosing layout bugs.

## Required Reading (Read First)
1. [`docs/architecture/TESTING_STRATEGY.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/architecture/TESTING_STRATEGY.md)
2. [`docs/00-start-here/Development Status.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/00-start-here/Development Status.md)

## Key Source Directories
- `apps/desktop/verify-app.mjs`
- `apps/desktop/measure-layout.mjs`
- `tests/`

## Non-Negotiable Rules
- **Triple-Viewport Inspection**: All visual and interactive layout tests must assert behavior across 1280×720, 1440×900, and 1920×1080.
- **Zero Console Errors**: Test suites must fail if any unhandled exception, React hydration error, or 404 image load is detected in the browser console.
- **No Mock Shortcuts for Invariants**: Domain invariant tests (e.g. blocked task completion guards) must assert that state remains unmodified in the persistent store.

## Validation Commands
```bash
cd apps/desktop
npm run lint
npm run build
npm run check:routes
npm run check:layout
```

## Post-Work Documentation Updates
- Update [`docs/architecture/TESTING_STRATEGY.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/architecture/TESTING_STRATEGY.md) with any new test suites or coverage requirements.
- Update [`docs/00-start-here/Development Status.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/00-start-here/Development Status.md) with updated test pass rates and verification timestamps.
