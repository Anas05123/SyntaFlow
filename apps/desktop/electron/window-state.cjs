/**
 * CoreDesk Desktop Window State Manager
 *
 * Persists and restores desktop window geometry:
 * - normal bounds (x, y, width, height)
 * - maximized state
 * - handles multi-monitor display changes safely (avoids off-screen windows)
 * - prevents accidentally reopening minimized
 * - debounces disk writes during window resize / move
 */

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_BOUNDS = {
  width: 1440,
  height: 900,
  minWidth: 960,
  minHeight: 640,
};

class WindowStateManager {
  constructor(userDataPath, options = {}) {
    this.userDataPath = userDataPath;
    this.filePath = path.join(userDataPath, 'window-state.json');
    this.defaultWidth = options.width || DEFAULT_BOUNDS.width;
    this.defaultHeight = options.height || DEFAULT_BOUNDS.height;
    this.minWidth = options.minWidth || DEFAULT_BOUNDS.minWidth;
    this.minHeight = options.minHeight || DEFAULT_BOUNDS.minHeight;
    this.debounceMs = options.debounceMs || 500;

    this.debounceTimer = null;
    this.state = this.loadState();
  }

  loadState() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf8');
        const parsed = JSON.parse(content);
        if (
          typeof parsed.width === 'number' &&
          typeof parsed.height === 'number' &&
          typeof parsed.version === 'number'
        ) {
          return {
            x: typeof parsed.x === 'number' ? parsed.x : undefined,
            y: typeof parsed.y === 'number' ? parsed.y : undefined,
            width: parsed.width,
            height: parsed.height,
            maximized: Boolean(parsed.maximized),
            version: parsed.version,
          };
        }
      }
    } catch (_e) {
      // Fallback on read/parse error
    }

    return {
      x: undefined,
      y: undefined,
      width: this.defaultWidth,
      height: this.defaultHeight,
      maximized: false,
      version: 1,
    };
  }

  /**
   * Determine safe bounds considering active displays and multi-monitor setups.
   * If saved coordinates fall outside all active displays or the previous monitor
   * is disconnected, centers the window safely on the primary display.
   */
  getSafeBounds(displays = [], primaryDisplay = null) {
    let { x, y, width, height, maximized } = this.state;

    // Enforce minimum usable dimensions
    width = Math.max(this.minWidth, width || this.defaultWidth);
    height = Math.max(this.minHeight, height || this.defaultHeight);

    // If no display info provided (e.g. headless unit testing without electron screen), return clamped bounds
    if (!displays || displays.length === 0 || !primaryDisplay) {
      return { x, y, width, height, maximized };
    }

    const primaryWorkArea = primaryDisplay.workArea || {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
    };

    // If coordinates are undefined, center on primary display
    if (typeof x !== 'number' || typeof y !== 'number') {
      const safeW = Math.min(width, primaryWorkArea.width);
      const safeH = Math.min(height, primaryWorkArea.height);
      return {
        x: Math.round(primaryWorkArea.x + (primaryWorkArea.width - safeW) / 2),
        y: Math.round(primaryWorkArea.y + (primaryWorkArea.height - safeH) / 2),
        width: safeW,
        height: safeH,
        maximized,
      };
    }

    // Check intersection: Is a reasonable titlebar/window area visible on ANY active display?
    const isVisibleOnAnyDisplay = displays.some((d) => {
      const wa = d.workArea;
      if (!wa) return false;
      // At least 120px horizontally and 60px of the top edge must intersect the display workArea
      const intersectsX = x + 120 <= wa.x + wa.width && x + width - 120 >= wa.x;
      const intersectsY = y + 40 <= wa.y + wa.height && y >= wa.y - 20;
      return intersectsX && intersectsY;
    });

    if (!isVisibleOnAnyDisplay) {
      // Saved coordinates were on a disconnected/moved screen — safely center on primary display
      const safeW = Math.min(width, primaryWorkArea.width);
      const safeH = Math.min(height, primaryWorkArea.height);
      return {
        x: Math.round(primaryWorkArea.x + (primaryWorkArea.width - safeW) / 2),
        y: Math.round(primaryWorkArea.y + (primaryWorkArea.height - safeH) / 2),
        width: safeW,
        height: safeH,
        maximized,
      };
    }

    return { x, y, width, height, maximized };
  }

  /**
   * Binds listeners to the BrowserWindow to track and persist state.
   */
  manage(win) {
    if (!win) return;

    const recordNormalBounds = () => {
      if (win.isDestroyed()) return;
      if (!win.isMaximized() && !win.isMinimized() && !win.isFullScreen()) {
        const bounds = win.getBounds();
        if (bounds && typeof bounds.width === 'number') {
          this.state.x = bounds.x;
          this.state.y = bounds.y;
          this.state.width = bounds.width;
          this.state.height = bounds.height;
        }
      }
    };

    // Record initial normal bounds on manage
    recordNormalBounds();

    const scheduleSave = () => {
      recordNormalBounds();
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        recordNormalBounds();
        if (!win.isDestroyed() && !win.isMinimized()) {
          this.state.maximized = win.isMaximized();
        }
        this.saveSync();
      }, this.debounceMs);
    };

    win.on('resize', scheduleSave);
    win.on('move', scheduleSave);

    win.on('close', () => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      // If closed while minimized: do NOT save minimized dimensions!
      // Preserve the last normal bounds and previous maximized status.
      if (!win.isMinimized()) {
        if (win.isMaximized()) {
          this.state.maximized = true;
          // Last normal bounds were already recorded prior to maximizing
        } else {
          this.state.maximized = false;
          recordNormalBounds();
        }
      }
      this.saveSync();
    });
  }

  saveSync() {
    try {
      fs.mkdirSync(this.userDataPath, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2), 'utf8');
    } catch (_e) {
      // Ignore write errors to prevent desktop app crashes
    }
  }
}

module.exports = {
  WindowStateManager,
  DEFAULT_BOUNDS,
};
