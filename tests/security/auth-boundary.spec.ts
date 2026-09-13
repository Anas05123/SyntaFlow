import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.shots') {
      return [];
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(full);
    return /\.[jt]sx?$/.test(entry.name) ? [full] : [];
  });
}

describe('Auth Security Boundary & Credential Isolation', () => {
  it('keeps raw crypto, safeStorage, and direct node primitives out of the React renderer', () => {
    const srcDir = path.join(repoRoot, 'apps/desktop/src');
    const files = collectSourceFiles(srcDir);
    const combined = files.map((f) => readFileSync(f, 'utf8')).join('\n');

    // React renderer must not import node crypto or safeStorage directly
    expect(combined).not.toMatch(/from\s+["'](?:node:crypto|crypto|safeStorage)["']/);
    expect(combined).not.toMatch(/\bsafeStorage\./);

    // Renderer must not invoke ipcRenderer directly
    expect(combined).not.toMatch(/\bipcRenderer\b/);
  });

  it('keeps preload auth bridge narrowly scoped to explicit typed methods', () => {
    const preloadSource = readFileSync(
      path.join(repoRoot, 'apps/desktop/electron/preload.cjs'),
      'utf8'
    );

    // Context bridge exposes explicit auth methods
    expect(preloadSource).toContain('getSession:');
    expect(preloadSource).toContain('signIn:');
    expect(preloadSource).toContain('signUp:');
    expect(preloadSource).toContain('signOut:');

    // Does not expose raw invoke or ipcRenderer
    expect(preloadSource).not.toMatch(/invoke:\s*\(/);
    expect(preloadSource).not.toMatch(/ipcRenderer\s*[,:]/);
  });
});
