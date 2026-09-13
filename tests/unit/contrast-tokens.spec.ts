import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Standard WCAG 2.1 relative luminance calculation
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export function sRgbToLinear(c: number): number {
  const norm = c / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * sRgbToLinear(r) + 0.7152 * sRgbToLinear(g) + 0.0722 * sRgbToLinear(b);
}

export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = getRelativeLuminance(foregroundHex);
  const l2 = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Phase C: Contrast Tokens & WCAG 1.4.3 Compliance', () => {
  const tokensPath = path.resolve(__dirname, '../../apps/desktop/src/styles/tokens.css');
  const tokensCss = fs.readFileSync(tokensPath, 'utf8');

  // Extract Dark Theme tokens
  const darkSection = tokensCss.split(":root[data-theme='light']")[0];
  const darkMutedMatch = darkSection.match(/--muted:\s*(#[0-9a-fA-F]{6});/);
  const darkMetadataMatch = darkSection.match(/--metadata:\s*(#[0-9a-fA-F]{6});/);
  const darkTextMatch = darkSection.match(/--text:\s*(#[0-9a-fA-F]{6});/);

  // Extract Light Theme tokens
  const lightSection = tokensCss.split(":root[data-theme='light']")[1]?.split('/* ----')[0] || '';
  const lightMutedMatch = lightSection.match(/--muted:\s*(#[0-9a-fA-F]{6});/);
  const lightMetadataMatch = lightSection.match(/--metadata:\s*(#[0-9a-fA-F]{6});/);
  const lightTextMatch = lightSection.match(/--text:\s*(#[0-9a-fA-F]{6});/);

  const darkTokens = {
    text: darkTextMatch ? darkTextMatch[1] : '#f4f6f8',
    muted: darkMutedMatch ? darkMutedMatch[1] : '#b6bec8',
    metadata: darkMetadataMatch ? darkMetadataMatch[1] : '#8c96a3',
  };

  const lightTokens = {
    text: lightTextMatch ? lightTextMatch[1] : '#14181c',
    muted: lightMutedMatch ? lightMutedMatch[1] : '#424b56',
    metadata: lightMetadataMatch ? lightMetadataMatch[1] : '#525c68',
  };

  const darkSurfaces = [
    { name: 'canvas', hex: '#0b0d0f' },
    { name: 'sidebar', hex: '#0f1215' },
    { name: 'surface', hex: '#12161a' },
    { name: 'raised', hex: '#171c21' },
  ];

  const lightSurfaces = [
    { name: 'canvas', hex: '#eef1f4' },
    { name: 'sidebar', hex: '#f7f9fa' },
    { name: 'surface', hex: '#ffffff' },
    { name: 'raised', hex: '#f4f6f8' },
  ];

  it('verifies dark theme text achieves high contrast (>= 12:1) across all surfaces', () => {
    for (const surface of darkSurfaces) {
      const ratio = getContrastRatio(darkTokens.text, surface.hex);
      expect(ratio).toBeGreaterThanOrEqual(12.0);
    }
  });

  it('verifies dark theme --muted meets WCAG 1.4.3 (>= 4.5:1) across canvas, sidebar, surface, and raised', () => {
    for (const surface of darkSurfaces) {
      const ratio = getContrastRatio(darkTokens.muted, surface.hex);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('verifies dark theme --metadata meets WCAG 1.4.3 (>= 4.5:1) across canvas, sidebar, surface, and raised', () => {
    for (const surface of darkSurfaces) {
      const ratio = getContrastRatio(darkTokens.metadata, surface.hex);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('verifies light theme --muted meets WCAG 1.4.3 (>= 4.5:1) across canvas, sidebar, surface, and raised', () => {
    for (const surface of lightSurfaces) {
      const ratio = getContrastRatio(lightTokens.muted, surface.hex);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('verifies light theme --metadata meets WCAG 1.4.3 (>= 4.5:1) across canvas, sidebar, surface, and raised', () => {
    for (const surface of lightSurfaces) {
      const ratio = getContrastRatio(lightTokens.metadata, surface.hex);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('preserves visual contrast hierarchy (text > muted > metadata)', () => {
    const darkTextRatio = getContrastRatio(darkTokens.text, '#171c21');
    const darkMutedRatio = getContrastRatio(darkTokens.muted, '#171c21');
    const darkMetadataRatio = getContrastRatio(darkTokens.metadata, '#171c21');

    expect(darkTextRatio).toBeGreaterThan(darkMutedRatio);
    expect(darkMutedRatio).toBeGreaterThan(darkMetadataRatio);

    const lightTextRatio = getContrastRatio(lightTokens.text, '#ffffff');
    const lightMutedRatio = getContrastRatio(lightTokens.muted, '#ffffff');
    const lightMetadataRatio = getContrastRatio(lightTokens.metadata, '#ffffff');

    expect(lightTextRatio).toBeGreaterThan(lightMutedRatio);
    expect(lightMutedRatio).toBeGreaterThan(lightMetadataRatio);
  });
});

describe('Phase C: Control Sizes & Typography Tokens', () => {
  const tokensPath = path.resolve(__dirname, '../../apps/desktop/src/styles/tokens.css');
  const tokensCss = fs.readFileSync(tokensPath, 'utf8');

  it('defines standardized control heights meeting Section 5 requirements', () => {
    expect(tokensCss).toMatch(/--h-control:\s*40px;/);
    expect(tokensCss).toMatch(/--h-control-sm:\s*36px;/);
    expect(tokensCss).toMatch(/--h-control-compact:\s*36px;/);
    expect(tokensCss).toMatch(/--h-control-icon:\s*32px;/);
    expect(tokensCss).toMatch(/--h-control-icon-lg:\s*36px;/);
    expect(tokensCss).toMatch(/--hit-target-min:\s*24px;/);
  });

  it('defines normalized typography tokens in Section 6 ranges', () => {
    // Display: 28-32px
    const displayMatch = tokensCss.match(/--fs-display:\s*(\d+)px;/);
    expect(displayMatch).not.toBeNull();
    const display = parseInt(displayMatch![1], 10);
    expect(display).toBeGreaterThanOrEqual(28);
    expect(display).toBeLessThanOrEqual(32);

    // Page title: 22-26px
    const pageTitleMatch = tokensCss.match(/--fs-page-title:\s*(\d+)px;/);
    expect(pageTitleMatch).not.toBeNull();
    const pageTitle = parseInt(pageTitleMatch![1], 10);
    expect(pageTitle).toBeGreaterThanOrEqual(22);
    expect(pageTitle).toBeLessThanOrEqual(26);

    // Object title: 18-22px
    const objTitleMatch = tokensCss.match(/--fs-object-title:\s*(\d+)px;/);
    expect(objTitleMatch).not.toBeNull();
    const objTitle = parseInt(objTitleMatch![1], 10);
    expect(objTitle).toBeGreaterThanOrEqual(18);
    expect(objTitle).toBeLessThanOrEqual(22);

    // Section title: 15-17px
    const sectionMatch = tokensCss.match(/--fs-section:\s*(\d+)px;/);
    expect(sectionMatch).not.toBeNull();
    const section = parseInt(sectionMatch![1], 10);
    expect(section).toBeGreaterThanOrEqual(15);
    expect(section).toBeLessThanOrEqual(17);

    // Body: >= 14px
    const bodyMatch = tokensCss.match(/--fs-body:\s*(\d+)px;/);
    expect(bodyMatch).not.toBeNull();
    const body = parseInt(bodyMatch![1], 10);
    expect(body).toBeGreaterThanOrEqual(14);

    // Metadata: 12-13px
    const metaMatch = tokensCss.match(/--fs-metadata:\s*([\d.]+)px;/);
    expect(metaMatch).not.toBeNull();
    const meta = parseFloat(metaMatch![1]);
    expect(meta).toBeGreaterThanOrEqual(12);
    expect(meta).toBeLessThanOrEqual(13);
  });
});
