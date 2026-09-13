/**
 * Desktop runtime bridge.
 *
 * CoreDesk's window is frameless, so minimize / maximize / close are drawn by the
 * renderer and must reach the main process. In a browser preview there is no main
 * process, so this hook degrades to "not a desktop window" and the chrome row
 * simply omits the controls.
 *
 * Nothing else in the app should talk to Electron directly. If a future screen
 * needs a native capability, add it here as its own named hook.
 */

import { useEffect, useState } from 'react';

interface WindowState {
  maximized: boolean;
  focused: boolean;
}

interface DesktopBridge {
  runtime?: string;
  electron?: string;
  platform?: string;
  window?: {
    minimize: () => void;
    toggleMaximize: () => void;
    close: () => void;
    onStateChange: (handler: (state: WindowState) => void) => () => void;
  };
}

function bridge(): DesktopBridge | null {
  const w = window as unknown as { coreDeskDesktop?: DesktopBridge };
  return w.coreDeskDesktop?.window ? w.coreDeskDesktop : null;
}

export interface DesktopWindow {
  /** True only inside Electron — the browser preview has no window controls. */
  isDesktop: boolean;
  maximized: boolean;
  focused: boolean;
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
}

export function useDesktopWindow(): DesktopWindow {
  const api = bridge();
  const [state, setState] = useState<WindowState>({ maximized: false, focused: true });

  useEffect(() => {
    if (!api?.window) return undefined;
    return api.window.onStateChange(setState);
  }, [api]);

  if (!api?.window) {
    return {
      isDesktop: false,
      maximized: false,
      focused: true,
      minimize: () => {},
      toggleMaximize: () => {},
      close: () => {},
    };
  }

  return {
    isDesktop: true,
    maximized: state.maximized,
    focused: state.focused,
    minimize: api.window.minimize,
    toggleMaximize: api.window.toggleMaximize,
    close: api.window.close,
  };
}
