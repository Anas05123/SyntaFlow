/**
 * Appearance controller & Adaptive Background Engine.
 *
 * Implements Section 12 (Appearance Control) & Section 13 (Background Engine):
 * IMAGE -> CROP/COVER -> LUMINANCE ANALYSIS -> BLUR -> DARK TINT -> ENVIRONMENTAL COLOR -> CONTENT SURFACE ADAPTATION
 *
 * Provides a shared AppearanceProvider and useAppearance hook.
 * Persists to localStorage and dynamically synchronizes CSS custom properties and document attributes.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_WALLPAPER } from './wallpaperPresets';

export type Theme = 'dark' | 'light';
export type ThemeMode = 'dark' | 'light' | 'system';
export type SurfaceMode = 'graphite' | 'deep' | 'soft';
export type BackgroundType = 'none' | 'gradient' | 'image';
export type FontChoice = 'inter' | 'system' | 'grotesk';

export interface Appearance {
  theme: Theme;
  mode: ThemeMode;
  surface: SurfaceMode;
  accent: string;
  background: BackgroundType;
  wallpaper: string | null;
  blur: number;       // 0-40px
  dim: number;        // 10-90%
  vibrancy: number;   // 0-100%
  font: FontChoice;
}

export const ACCENTS: { id: string; label: string; value: string }[] = [
  { id: 'cobalt', label: 'CoreDesk Blue', value: '#2F6FEB' },
  { id: 'azure', label: 'Azure', value: '#3D8BFD' },
  { id: 'cyan', label: 'Cyan', value: '#12A5C4' },
  { id: 'teal', label: 'Teal', value: '#0F9E8A' },
  { id: 'violet', label: 'Violet', value: '#6E5BE8' },
  { id: 'amber', label: 'Amber', value: '#C08A2E' },
  { id: 'green', label: 'Green', value: '#2F9E5F' },
];

export const FONTS: { id: FontChoice; label: string; stack: string }[] = [
  { id: 'inter', label: 'Inter', stack: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { id: 'system', label: 'System', stack: "ui-sans-serif, system-ui, 'Segoe UI', sans-serif" },
  { id: 'grotesk', label: 'Grotesk', stack: "'Inter Tight', Inter, ui-sans-serif, system-ui, sans-serif" },
];

export const DEFAULT_APPEARANCE: Appearance = {
  theme: 'dark',
  mode: 'dark',
  surface: 'graphite',
  accent: '#2F6FEB',
  background: 'none',
  wallpaper: null,
  blur: 18,
  dim: 55,
  vibrancy: 20,
  font: 'inter',
};

const KEY = 'coredesk.appearance.v2';
const LEGACY_KEY = 'coredesk.appearance.v1';

function readInitial(): Appearance {
  if (typeof localStorage === 'undefined') return DEFAULT_APPEARANCE;
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
    if (!raw) return DEFAULT_APPEARANCE;
    const parsed = JSON.parse(raw);
    const bg = parsed.background || (parsed.wallpaper ? 'image' : 'none');
    return {
      ...DEFAULT_APPEARANCE,
      ...parsed,
      mode: parsed.mode || parsed.theme || 'dark',
      surface: parsed.surface === 'solid' ? 'graphite' : parsed.surface === 'glass' ? 'soft' : (parsed.surface || 'graphite'),
      background: bg,
      wallpaper: parsed.wallpaper || (bg === 'image' ? DEFAULT_WALLPAPER : null),
      blur: typeof parsed.blur === 'number' ? parsed.blur : 18,
      dim: typeof parsed.dim === 'number' ? parsed.dim : 55,
      vibrancy: typeof parsed.vibrancy === 'number' ? parsed.vibrancy : 20,
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

/** Analyzes image luminance and dominant color to adapt surface tint and scrim. */
function analyzeLuminance(imageSrc: string, onDone: (l: number, tint: string) => void) {
  if (typeof document === 'undefined') return;
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (!ctx) { onDone(0.3, 'rgb(20, 24, 32)'); return; }
      ctx.drawImage(img, 0, 0, 16, 16);
      const data = ctx.getImageData(0, 0, 16, 16).data;
      let totalL = 0;
      let rSum = 0, gSum = 0, bSum = 0;
      const count = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        rSum += r; gSum += g; bSum += b;
        totalL += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      }
      const avgL = totalL / count;
      const tint = `rgb(${Math.round(rSum / count)}, ${Math.round(gSum / count)}, ${Math.round(bSum / count)})`;
      onDone(avgL, tint);
    } catch {
      onDone(0.3, 'rgb(20, 24, 32)');
    }
  };
  img.onerror = () => onDone(0.3, 'rgb(20, 24, 32)');
  img.src = imageSrc;
}

export interface AppearanceContextValue {
  appearance: Appearance;
  resolvedTheme: Theme;
  patch: (next: Partial<Appearance>) => void;
  reset: () => void;
  toggleTheme: () => void;
  envLuminance: number;
  envTint: string;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>(readInitial);
  const [envLuminance, setEnvLuminance] = useState<number>(0.3);
  const [envTint, setEnvTint] = useState<string>('rgb(20, 24, 32)');

  // Track system dark mode preference
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Compute resolved active theme ('dark' | 'light')
  const resolvedTheme: Theme = useMemo(() => {
    if (appearance.mode === 'system') {
      return systemDark ? 'dark' : 'light';
    }
    return appearance.mode === 'light' ? 'light' : 'dark';
  }, [appearance.mode, systemDark]);

  // Run image luminance analysis whenever wallpaper changes
  useEffect(() => {
    if (appearance.background === 'image') {
      const src = appearance.wallpaper || DEFAULT_WALLPAPER;
      if (src) {
        analyzeLuminance(src, (lum, tint) => {
          setEnvLuminance(lum);
          setEnvTint(tint);
        });
      }
    } else {
      setEnvLuminance(0.3);
      setEnvTint('rgb(20, 24, 32)');
    }
  }, [appearance.background, appearance.wallpaper]);

  // Apply appearance attributes and custom properties to documentElement
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const a = appearance;

    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-surface', a.surface);

    // Surface Ladder calculation
    let surfaceBg = '#12161a';
    let sidebarBg = '#0f1215';
    let raisedBg = '#171c21';
    let fieldBg = '#0e1114';
    let dividerColor = '#262c33';
    let edgeColor = '#323a43';

    if (resolvedTheme === 'dark') {
      if (a.surface === 'deep') {
        surfaceBg = '#090a0d';
        sidebarBg = '#060709';
        raisedBg = '#0e1014';
        fieldBg = '#060709';
        dividerColor = '#1d2228';
        edgeColor = '#272e36';
      } else if (a.surface === 'soft') {
        surfaceBg = '#161a20';
        sidebarBg = '#101318';
        raisedBg = '#1c2128';
        fieldBg = '#12151a';
        dividerColor = '#2b323c';
        edgeColor = '#37404c';
      }
    } else {
      // LIGHT THEME
      surfaceBg = '#ffffff';
      sidebarBg = '#f7f9fa';
      raisedBg = '#f4f6f8';
      fieldBg = '#ffffff';
      dividerColor = '#dde2e7';
      edgeColor = '#c8cfd6';

      if (a.surface === 'deep') {
        sidebarBg = '#eef2f6';
        raisedBg = '#e9eff5';
        fieldBg = '#f8fafc';
        dividerColor = '#d0d7de';
        edgeColor = '#bec6cf';
      } else if (a.surface === 'soft') {
        sidebarBg = '#fafbfc';
        raisedBg = '#f5f7fa';
        fieldBg = '#ffffff';
        dividerColor = '#e2e6eb';
        edgeColor = '#cfd6dd';
      }
    }

    const fontStack = FONTS.find((f) => f.id === a.font)?.stack ?? FONTS[0].stack;
    const hoverColor = resolvedTheme === 'dark'
      ? `color-mix(in srgb, ${a.accent} 82%, white)`
      : `color-mix(in srgb, ${a.accent} 82%, black)`;

    const activeWallpaper = a.wallpaper || DEFAULT_WALLPAPER;

    // Luminance-adaptive scrim calculation:
    // Bright images need slightly more scrim to preserve text contrast; dark images need less scrim so details aren't crushed.
    const lumFactor = envLuminance > 0.5 ? 1.15 : 0.8;
    const scrimTint = resolvedTheme === 'dark'
      ? Math.min(0.85, Math.max(0.12, (a.dim / 100) * lumFactor))
      : Math.min(0.88, Math.max(0.18, a.dim / 100));

    const wallpaperOpacity = a.background === 'none'
      ? '0'
      : String(Math.min(1, Math.max(0.7, (100 - a.dim * 0.15) / 100)));

    const panelAlpha = String(Math.max(0.68, 0.92 - (a.vibrancy / 260)));

    const vars: Record<string, string> = {
      '--accent': a.accent,
      '--accent-hover': hoverColor,
      '--accent-tint': `color-mix(in srgb, ${a.accent} 12%, transparent)`,
      '--row-selected': `color-mix(in srgb, ${a.accent} 9%, transparent)`,
      '--font': fontStack,
      '--surface': surfaceBg,
      '--sidebar': sidebarBg,
      '--raised': raisedBg,
      '--field-bg': fieldBg,
      '--divider': dividerColor,
      '--edge': edgeColor,
      '--wallpaper-blur': `${a.blur}px`,
      '--wallpaper-tint': String(scrimTint),
      '--wallpaper-opacity': wallpaperOpacity,
      '--panel-alpha': panelAlpha,
    };

    for (const [k, v] of Object.entries(vars)) {
      root.style.setProperty(k, v);
    }

    if (a.background === 'image') {
      root.setAttribute('data-wallpaper', 'image');
      root.style.setProperty('--wallpaper-image', `url("${activeWallpaper}")`);
      root.style.setProperty('--wallpaper-opacity', wallpaperOpacity);
    } else if (a.background === 'gradient') {
      root.setAttribute('data-wallpaper', 'gradient');
      root.style.setProperty(
        '--wallpaper-image',
        resolvedTheme === 'dark'
          ? 'radial-gradient(ellipse at 50% -10%, rgba(47, 111, 235, 0.22), transparent 60%), radial-gradient(circle at 90% 80%, rgba(37, 183, 243, 0.12), transparent 50%)'
          : 'radial-gradient(ellipse at 50% -10%, rgba(47, 111, 235, 0.12), transparent 60%), radial-gradient(circle at 90% 80%, rgba(37, 183, 243, 0.08), transparent 50%)'
      );
      root.style.setProperty('--wallpaper-opacity', wallpaperOpacity);
    } else {
      root.removeAttribute('data-wallpaper');
      root.style.removeProperty('--wallpaper-image');
      root.style.setProperty('--wallpaper-opacity', '0');
    }

    try {
      localStorage.setItem(KEY, JSON.stringify({ ...a, theme: resolvedTheme }));
      localStorage.setItem('coredesk.theme', resolvedTheme);
    } catch {}
  }, [appearance, resolvedTheme, envLuminance, envTint]);

  const patch = useCallback((next: Partial<Appearance>) => {
    setAppearance((prev) => {
      const updated = { ...prev, ...next };
      if (next.mode === 'dark') updated.theme = 'dark';
      if (next.mode === 'light') updated.theme = 'light';
      return updated;
    });
  }, []);

  const reset = useCallback(() => {
    setAppearance(DEFAULT_APPEARANCE);
  }, []);

  const toggleTheme = useCallback(() => {
    setAppearance((p) => {
      const current = p.mode === 'system' ? (systemDark ? 'dark' : 'light') : p.mode;
      const nextMode: ThemeMode = current === 'dark' ? 'light' : 'dark';
      return {
        ...p,
        mode: nextMode,
        theme: nextMode === 'dark' ? 'dark' : 'light',
      };
    });
  }, [systemDark]);

  const value = useMemo(
    () => ({
      appearance,
      resolvedTheme,
      patch,
      reset,
      toggleTheme,
      envLuminance,
      envTint,
    }),
    [appearance, resolvedTheme, patch, reset, toggleTheme, envLuminance, envTint]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    return {
      appearance: DEFAULT_APPEARANCE,
      resolvedTheme: 'dark',
      patch: () => {},
      reset: () => {},
      toggleTheme: () => {},
      envLuminance: 0.3,
      envTint: 'rgb(20, 24, 32)',
    };
  }
  return ctx;
}
