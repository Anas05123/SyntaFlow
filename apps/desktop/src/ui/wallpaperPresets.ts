/**
 * Curated Atmospheric Wallpaper Presets for CoreDesk Desktop.
 *
 * Implements Section 13 (Background Engine):
 * Resolution-independent, zero-latency, high-definition SVG mesh/nebula wallpapers.
 */

export interface WallpaperPreset {
  id: string;
  name: string;
  accent: string;
  dataUrl: string;
}

// 1. Obsidian Horizon — Signature dark graphite with deep ambient blue horizon
const OBSIDIAN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="o1" cx="25%" cy="20%" r="65%">
      <stop offset="0%" stop-color="#1b2838" stop-opacity="0.9"/>
      <stop offset="55%" stop-color="#0f1722" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#080c10" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="o2" cx="80%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#162b4d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#0d182b" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#080c10" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="o3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22427a" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#080c10" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="#090d12"/>
  <rect width="1920" height="1080" fill="url(#o1)"/>
  <rect width="1920" height="1080" fill="url(#o2)"/>
  <rect width="1920" height="1080" fill="url(#o3)"/>
</svg>`;

// 2. Cobalt Nebula — CoreDesk Cobalt Blue & Cyan atmospheric energy
const COBALT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="c1" cx="20%" cy="15%" r="55%">
      <stop offset="0%" stop-color="#2f6feb" stop-opacity="0.5"/>
      <stop offset="50%" stop-color="#1a3b80" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#06090e" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="c2" cx="85%" cy="85%" r="60%">
      <stop offset="0%" stop-color="#25b7f3" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="#0e4b6e" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#06090e" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="c3" cx="65%" cy="25%" r="45%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#06090e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="#070a0f"/>
  <rect width="1920" height="1080" fill="url(#c1)"/>
  <rect width="1920" height="1080" fill="url(#c2)"/>
  <rect width="1920" height="1080" fill="url(#c3)"/>
</svg>`;

// 3. Deep Aurora — Emerald & Teal atmospheric glow
const AURORA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="a1" cx="30%" cy="25%" r="55%">
      <stop offset="0%" stop-color="#0d766e" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="#064e3b" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#050a09" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="a2" cx="80%" cy="70%" r="50%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#09354d" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#050a09" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="#050a09"/>
  <rect width="1920" height="1080" fill="url(#a1)"/>
  <rect width="1920" height="1080" fill="url(#a2)"/>
</svg>`;

// 4. Midnight Velvet — Rich violet & slate atmospheric mesh
const MIDNIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="m1" cx="20%" cy="75%" r="60%">
      <stop offset="0%" stop-color="#581c87" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="#2e1065" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#08070d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="m2" cx="75%" cy="25%" r="55%">
      <stop offset="0%" stop-color="#312e81" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="#14133b" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#08070d" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="#07060a"/>
  <rect width="1920" height="1080" fill="url(#m1)"/>
  <rect width="1920" height="1080" fill="url(#m2)"/>
</svg>`;

function svgToDataUrl(svg: string): string {
  if (typeof window === 'undefined') return '';
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg.trim())))}`;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    accent: '#1e3a5f',
    dataUrl: typeof window !== 'undefined' ? svgToDataUrl(OBSIDIAN_SVG) : '',
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    accent: '#2f6feb',
    dataUrl: typeof window !== 'undefined' ? svgToDataUrl(COBALT_SVG) : '',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    accent: '#0d766e',
    dataUrl: typeof window !== 'undefined' ? svgToDataUrl(AURORA_SVG) : '',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    accent: '#581c87',
    dataUrl: typeof window !== 'undefined' ? svgToDataUrl(MIDNIGHT_SVG) : '',
  },
];

export const DEFAULT_WALLPAPER = typeof window !== 'undefined' ? svgToDataUrl(OBSIDIAN_SVG) : '';

export function getPresetById(id: string): WallpaperPreset | undefined {
  return WALLPAPER_PRESETS.find((p) => p.id === id);
}

export function isPresetDataUrl(dataUrl: string | null): boolean {
  if (!dataUrl) return false;
  return WALLPAPER_PRESETS.some((p) => p.dataUrl === dataUrl);
}

/**
 * Optimizes an uploaded user image:
 * Resizes down to max 1920x1080 (maintaining aspect ratio) and outputs high-quality
 * compressed JPEG data URL (~120-250KB) that fits easily in localStorage.
 */
export function processImageUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|bmp|svg|jfif)$/i.test(file.name);
    if (!isImage) {
      reject(new Error('Please select an image file (PNG, JPEG, WebP, AVIF, or BMP)'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read image file'));
    reader.onload = () => {
      const src = String(reader.result);
      // If already an SVG data URL, return directly
      if (src.startsWith('data:image/svg+xml')) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Unable to decode image'));
      img.onload = () => {
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // High quality compressed JPEG ~180KB, perfect for fast localStorage and instant load
        const compressed = canvas.toDataURL('image/jpeg', 0.88);
        resolve(compressed);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
