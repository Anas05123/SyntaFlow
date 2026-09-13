import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { EventEmitter } from 'node:events';

// Import WindowStateManager from desktop electron
const { WindowStateManager } = require('../../apps/desktop/electron/window-state.cjs');

describe('WindowStateManager', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cd-win-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_e) {}
  });

  it('provides sensible default bounds when no prior state is stored', () => {
    const manager = new WindowStateManager(tmpDir, { width: 1440, height: 900 });
    const bounds = manager.getSafeBounds();

    expect(bounds.width).toBe(1440);
    expect(bounds.height).toBe(900);
    expect(bounds.maximized).toBe(false);
  });

  it('persists and restores normal bounds', () => {
    const manager1 = new WindowStateManager(tmpDir, { debounceMs: 5 });
    
    // Simulate window
    class MockWin extends EventEmitter {
      private isMax = false;
      private isMin = false;
      private bounds = { x: 150, y: 120, width: 1280, height: 800 };

      getBounds() { return this.bounds; }
      setBounds(b: typeof this.bounds) { this.bounds = b; }
      isMaximized() { return this.isMax; }
      isMinimized() { return this.isMin; }
      isFullScreen() { return false; }
      isDestroyed() { return false; }
    }

    const win = new MockWin();
    manager1.manage(win);

    win.setBounds({ x: 200, y: 150, width: 1300, height: 850 });
    win.emit('close');

    // Reload from disk in a fresh manager instance
    const manager2 = new WindowStateManager(tmpDir);
    const restored = manager2.getSafeBounds();

    expect(restored.x).toBe(200);
    expect(restored.y).toBe(150);
    expect(restored.width).toBe(1300);
    expect(restored.height).toBe(850);
    expect(restored.maximized).toBe(false);
  });

  it('restores maximized state while retaining the previous normal bounds', () => {
    const manager = new WindowStateManager(tmpDir, { debounceMs: 5 });

    class MockWin extends EventEmitter {
      isMax = false;
      bounds = { x: 100, y: 100, width: 1200, height: 750 };
      getBounds() { return this.bounds; }
      isMaximized() { return this.isMax; }
      isMinimized() { return false; }
      isFullScreen() { return false; }
      isDestroyed() { return false; }
    }

    const win = new MockWin();
    manager.manage(win);

    // Initial normal layout
    win.emit('resize');

    // Window maximized
    win.isMax = true;
    win.bounds = { x: 0, y: 0, width: 1920, height: 1080 };
    win.emit('close');

    // Reopen
    const manager2 = new WindowStateManager(tmpDir);
    const bounds = manager2.getSafeBounds();

    expect(bounds.maximized).toBe(true);
    // Preserved normal dimensions, not the screen dimensions
    expect(bounds.width).toBe(1200);
    expect(bounds.height).toBe(750);
  });

  it('does NOT reopen invisibly if closed while minimized', () => {
    const manager = new WindowStateManager(tmpDir);

    class MockWin extends EventEmitter {
      minimized = false;
      bounds = { x: 300, y: 200, width: 1280, height: 800 };
      getBounds() { return this.bounds; }
      isMaximized() { return false; }
      isMinimized() { return this.minimized; }
      isFullScreen() { return false; }
      isDestroyed() { return false; }
    }

    const win = new MockWin();
    manager.manage(win);

    // Normal position recorded
    win.emit('resize');

    // User minimized the window, then closed it through taskbar / OS shutdown
    win.minimized = true;
    win.bounds = { x: -32000, y: -32000, width: 160, height: 28 }; // Windows minimized coordinates
    win.emit('close');

    // Next launch
    const manager2 = new WindowStateManager(tmpDir);
    const restored = manager2.getSafeBounds();

    expect(restored.x).toBe(300);
    expect(restored.y).toBe(200);
    expect(restored.width).toBe(1280);
    expect(restored.height).toBe(800);
  });

  it('safely recovers when coordinates fall off-screen due to disconnected monitors', () => {
    // Write state indicating window was on an external monitor at x: 2500, y: 300
    fs.writeFileSync(
      path.join(tmpDir, 'window-state.json'),
      JSON.stringify({
        x: 2500,
        y: 300,
        width: 1200,
        height: 800,
        maximized: false,
        version: 1,
      })
    );

    const manager = new WindowStateManager(tmpDir);

    // Only 1 display now active (single monitor laptop at 1920x1080)
    const displays = [
      {
        id: 1,
        workArea: { x: 0, y: 0, width: 1920, height: 1040 },
      },
    ];
    const primary = displays[0];

    const safe = manager.getSafeBounds(displays, primary);

    // The offscreen coordinate must be reset to lie safely within primary work area
    expect(safe.x).toBeGreaterThanOrEqual(0);
    expect(safe.x + safe.width).toBeLessThanOrEqual(1920);
    expect(safe.y).toBeGreaterThanOrEqual(0);
    expect(safe.y + safe.height).toBeLessThanOrEqual(1040);
  });

  it('clamps minimum usable dimensions (min 960x640)', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'window-state.json'),
      JSON.stringify({
        x: 100,
        y: 100,
        width: 400, // Invalid small size
        height: 300,
        maximized: false,
        version: 1,
      })
    );

    const manager = new WindowStateManager(tmpDir);
    const bounds = manager.getSafeBounds();

    expect(bounds.width).toBe(960);
    expect(bounds.height).toBe(640);
  });
});
