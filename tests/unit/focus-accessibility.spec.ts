import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Phase E Automated Verification:
 * 1. Focus Visible System (Section 26 & WCAG 2.4.7)
 * 2. Operational Surface Opacity Rules under Wallpaper (Section 29)
 * 3. Startup Timing & Readiness Semantics (Section 28)
 */

describe('Cross-Product Consistency & Accessibility (Phase E)', () => {
  const stylesDir = path.resolve(__dirname, '../../apps/desktop/src/styles');
  const baseCss = fs.readFileSync(path.join(stylesDir, 'base.css'), 'utf8');
  const layoutCss = fs.readFileSync(path.join(stylesDir, 'layout.css'), 'utf8');
  const componentsCss = fs.readFileSync(path.join(stylesDir, 'components.css'), 'utf8');
  const startupOverlayCode = fs.readFileSync(
    path.resolve(__dirname, '../../apps/desktop/src/components/StartupOverlay.tsx'),
    'utf8'
  );

  describe('Focus Visible System (Section 26 & WCAG 2.4.7)', () => {
    it('defines canonical 2px cobalt focus ring with 2px offset in base.css', () => {
      expect(baseCss).toContain('outline: 2px solid var(--accent);');
      expect(baseCss).toContain('outline-offset: 2px;');
    });

    it('covers all Section 26 required interactive elements in focus-visible rule', () => {
      const requiredSelectors = [
        'button:focus-visible',
        '.btn:focus-visible',
        '.rail-item:focus-visible',
        '.rail-brand:focus-visible',
        '.rail-owner:focus-visible',
        '.menu-item:focus-visible',
        '.cd-menu-item:focus-visible',
        '.tab-link:focus-visible',
        '[role="tab"]:focus-visible',
        '.outline-item:focus-visible',
        '.cd-projects-table-row:focus-visible',
        '.cd-focus-item:focus-visible',
      ];

      for (const sel of requiredSelectors) {
        expect(baseCss).toContain(sel);
      }
    });

    it('ensures inputs, selects, and textareas have explicit focus-visible rings in components.css', () => {
      expect(componentsCss).toContain('.input:focus-visible');
      expect(componentsCss).toContain('.select:focus-visible');
      expect(componentsCss).toContain('.textarea:focus-visible');
      expect(componentsCss).toContain('outline: 2px solid var(--accent);');
    });
  });

  describe('Wallpaper & Material Boundaries (Section 29)', () => {
    it('enforces high-opacity / solid background on operational surfaces when data-wallpaper is active', () => {
      expect(layoutCss).toContain(':root[data-wallpaper] .doc-page');
      expect(layoutCss).toContain(':root[data-wallpaper] .cd-projects-table');
      expect(layoutCss).toContain(':root[data-wallpaper] .cd-section-editor-box');
      expect(layoutCss).toContain(':root[data-wallpaper] .inspector');
      expect(layoutCss).toContain(':root[data-wallpaper] .cd-review-inspector');
      expect(layoutCss).toContain('backdrop-filter: none;');
    });
  });

  describe('Startup Timing Polish (Section 28)', () => {
    it('does not enforce fake 850ms artificial minimum delay when workspace is ready', () => {
      // The old forced 850ms delay should no longer be present in StartupOverlay
      expect(startupOverlayCode).not.toContain('minTime = prefersReducedMotion ? 350 : 850;');
    });

    it('updates status label to "Workspace ready" instead of persisting "Reconnecting workspace"', () => {
      expect(startupOverlayCode).toContain("ready ? 'Workspace ready' : 'Reconnecting workspace'");
    });

    it('settles animation immediately if ready is already true on mount', () => {
      expect(startupOverlayCode).toContain('if (ready) {');
      expect(startupOverlayCode).toContain('setAnimationSettled(true);');
    });
  });
});
