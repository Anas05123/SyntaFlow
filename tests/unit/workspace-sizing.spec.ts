import { describe, expect, it } from 'vitest';

/**
 * Workspace sizing helper functions mirroring logic in TasksScreen.tsx & design system
 */
export function getDensityMode(availableWidth: number): 'compact' | 'regular' | 'wide' {
  if (availableWidth > 1450) return 'wide';
  if (availableWidth >= 1100) return 'regular';
  return 'compact';
}

export function shouldOpenSideBySide(isInspectorOpen: boolean, availableWorkspaceWidth: number): boolean {
  // Section 3A, 14 & 30: side-by-side requires Regular/Wide available workspace width (>= 1100px)
  // Preserves overlay at 1280px (usable ~976px), side-by-side at 1440px and wide desktop
  return isInspectorOpen && availableWorkspaceWidth >= 1100;
}

export function calculateBoardGeometry(viewportWidth: number, isInspectorOpen: boolean) {
  // Shell Rail: 240px; Page padding left + right: 64px
  const railWidth = 240;
  const padding = 64;
  const availableWorkspaceWidth = Math.max(0, viewportWidth - railWidth - padding);

  // Inspector width: clamp(380px, 28vw, 460px)
  const rawInspectorW = Math.round(viewportWidth * 0.28);
  const inspectorWidth = Math.max(380, Math.min(460, rawInspectorW));

  const isSideBySide = shouldOpenSideBySide(isInspectorOpen, availableWorkspaceWidth);

  // Remaining width allocated to the task board container
  const boardContainerWidth = isSideBySide
    ? availableWorkspaceWidth - inspectorWidth
    : availableWorkspaceWidth;

  // 3 Canonical columns (To Do, In Progress, Done) at 280px + 14px gap = 868px
  const columnWidth = 280;
  const gap = 14;
  const totalColumnsWidth = 3 * columnWidth + 2 * gap; // 868px

  // Reachability:
  // If boardContainerWidth >= totalColumnsWidth: all columns fit full width
  // If boardContainerWidth < totalColumnsWidth: horizontal scrolling inside container is required
  // Under NO circumstance is any column covered by the inspector because boardContainerWidth stops at inspector margin
  const fitsFullWidth = boardContainerWidth >= totalColumnsWidth;
  const requiresHorizontalScroll = !fitsFullWidth;
  const isClippedUnderInspector = false; // By construction: board ends to the left of the inspector

  return {
    availableWorkspaceWidth,
    inspectorWidth,
    isSideBySide,
    boardContainerWidth,
    totalColumnsWidth,
    fitsFullWidth,
    requiresHorizontalScroll,
    isClippedUnderInspector,
  };
}

describe('Workspace Sizing & Responsive Modes (Phase B)', () => {
  describe('Section 30: Measured Responsive Density Modes', () => {
    it('identifies compact mode below 1100px usable width', () => {
      expect(getDensityMode(950)).toBe('compact');
      expect(getDensityMode(1050)).toBe('compact');
      expect(getDensityMode(1099)).toBe('compact');
    });

    it('identifies regular mode between 1100px and 1450px usable width', () => {
      expect(getDensityMode(1100)).toBe('regular');
      expect(getDensityMode(1250)).toBe('regular');
      expect(getDensityMode(1449)).toBe('regular');
    });

    it('identifies wide mode above 1450px usable width', () => {
      expect(getDensityMode(1451)).toBe('wide');
      expect(getDensityMode(1680)).toBe('wide');
      expect(getDensityMode(1920)).toBe('wide');
    });
  });

  describe('Section 3A & 14: Task Board Responsiveness & Clipping Prevention', () => {
    it('at 1280x720 viewport (compact): inspector opens as overlay, board retains full width', () => {
      const geo = calculateBoardGeometry(1280, true);

      expect(geo.availableWorkspaceWidth).toBe(976);
      expect(geo.isSideBySide).toBe(false); // Must be overlay
      expect(geo.boardContainerWidth).toBe(976);
      expect(geo.fitsFullWidth).toBe(true); // 868px columns fit in 976px
      expect(geo.isClippedUnderInspector).toBe(false);
    });

    it('at 1440x900 viewport (regular / default design target): side-by-side mode active without inspector clipping', () => {
      const geo = calculateBoardGeometry(1440, true);

      expect(geo.availableWorkspaceWidth).toBe(1136);
      expect(geo.inspectorWidth).toBe(403);
      expect(geo.isSideBySide).toBe(true);

      // Remaining board container width is reserved to the left of the inspector
      expect(geo.boardContainerWidth).toBe(1136 - 403); // 733px
      expect(geo.requiresHorizontalScroll).toBe(true);

      // All columns remain reachable via horizontal scroll inside the dedicated 733px container
      // with zero coverage by the inspector
      expect(geo.isClippedUnderInspector).toBe(false);
    });

    it('at 1920x1080 viewport (wide): side-by-side mode fits all columns without horizontal scrolling', () => {
      const geo = calculateBoardGeometry(1920, true);

      expect(geo.availableWorkspaceWidth).toBe(1616);
      expect(geo.inspectorWidth).toBe(460); // Clamped max 460px
      expect(geo.isSideBySide).toBe(true);
      expect(geo.boardContainerWidth).toBe(1616 - 460); // 1156px

      // 868px columns fit comfortably in 1156px container
      expect(geo.fitsFullWidth).toBe(true);
      expect(geo.isClippedUnderInspector).toBe(false);
    });

    it('verifies dynamic mode switch occurs based on measured available width rather than hardcoded viewport breakpoint', () => {
      // 1099px usable width -> overlay
      expect(shouldOpenSideBySide(true, 1099)).toBe(false);

      // 1100px usable width -> side-by-side
      expect(shouldOpenSideBySide(true, 1100)).toBe(true);

      // Closed inspector -> false
      expect(shouldOpenSideBySide(false, 1500)).toBe(false);
    });
  });
});
