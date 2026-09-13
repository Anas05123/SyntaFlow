import { describe, expect, it } from 'vitest';

/**
 * Mirror of input event filtering in apps/desktop/electron/main.cjs
 */
function shouldPreventInput(input: {
  type: string;
  key: string;
  control?: boolean;
  meta?: boolean;
  shift?: boolean;
}, mode: string): boolean {
  if (mode === 'dev') return false;
  if (input.type !== 'keyDown') return false;

  const isF5 = input.key === 'F5';
  const isR = input.key.toLowerCase() === 'r';
  const isCtrlOrCmd = Boolean(input.control || input.meta);

  return isF5 || (isCtrlOrCmd && isR);
}

describe('Desktop Production Refresh Protection', () => {
  it('blocks F5 reload in production', () => {
    const intercepted = shouldPreventInput(
      { type: 'keyDown', key: 'F5' },
      'built'
    );
    expect(intercepted).toBe(true);
  });

  it('blocks Ctrl+R reload in production', () => {
    const intercepted = shouldPreventInput(
      { type: 'keyDown', key: 'r', control: true },
      'built'
    );
    expect(intercepted).toBe(true);
  });

  it('blocks Ctrl+Shift+R hard reload in production', () => {
    const intercepted = shouldPreventInput(
      { type: 'keyDown', key: 'R', control: true, shift: true },
      'built'
    );
    expect(intercepted).toBe(true);
  });

  it('blocks Cmd+R on macOS in production', () => {
    const intercepted = shouldPreventInput(
      { type: 'keyDown', key: 'r', meta: true },
      'built'
    );
    expect(intercepted).toBe(true);
  });

  it('preserves developer workflow in dev mode', () => {
    expect(shouldPreventInput({ type: 'keyDown', key: 'F5' }, 'dev')).toBe(false);
    expect(shouldPreventInput({ type: 'keyDown', key: 'r', control: true }, 'dev')).toBe(false);
  });

  it('never interferes with standard desktop and productivity shortcuts', () => {
    // Copy
    expect(shouldPreventInput({ type: 'keyDown', key: 'c', control: true }, 'built')).toBe(false);
    // Paste
    expect(shouldPreventInput({ type: 'keyDown', key: 'v', control: true }, 'built')).toBe(false);
    // Undo
    expect(shouldPreventInput({ type: 'keyDown', key: 'z', control: true }, 'built')).toBe(false);
    // CoreDesk Command Palette (Ctrl+K)
    expect(shouldPreventInput({ type: 'keyDown', key: 'k', control: true }, 'built')).toBe(false);
    // Text input
    expect(shouldPreventInput({ type: 'keyDown', key: 'a' }, 'built')).toBe(false);
    expect(shouldPreventInput({ type: 'keyDown', key: 'Enter' }, 'built')).toBe(false);
  });
});
