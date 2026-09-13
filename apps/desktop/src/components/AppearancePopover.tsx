/**
 * Appearance Popover floating control panel (Section 12).
 *
 * Provides instant floating controls for:
 * - THEME MODE: [ Dark ] [ Light ] [ System ]
 * - SURFACE: Graphite / Deep / Soft
 * - ACCENT: CoreDesk Blue + swatches
 * - BACKGROUND: [ None ] [ Gradient ] [ Image ]
 * - Continuous sliders: Blur, Dim, Vibrancy
 */

import { useRef, useState } from 'react';
import {
  useAppearance,
  ACCENTS,
  type SurfaceMode,
  type BackgroundType,
} from '../ui/useAppearance';
import {
  WALLPAPER_PRESETS,
  DEFAULT_WALLPAPER,
  isPresetDataUrl,
  processImageUpload,
} from '../ui/wallpaperPresets';
import { Icon } from '../ui/Icon';

interface AppearancePopoverProps {
  onClose?: () => void;
}

export function AppearancePopover({ onClose: _onClose }: AppearancePopoverProps) {
  const { appearance, resolvedTheme, patch, reset } = useAppearance();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onSelectImage = async (file: File | undefined) => {
    if (!file) return;
    setIsProcessing(true);
    setUploadError(null);
    try {
      const optimized = await processImageUpload(file);
      patch({ wallpaper: optimized, background: 'image' });
    } catch (err: any) {
      setUploadError(err.message || 'Failed to load image');
    } finally {
      setIsProcessing(false);
    }
  };

  const isCustom = Boolean(appearance.wallpaper && !isPresetDataUrl(appearance.wallpaper));

  return (
    <div className="ap-popover" role="dialog" aria-label="Appearance controls">
      {/* Hidden file input always mounted to ensure reliable file dialogs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.png,.jpg,.jpeg,.webp,.avif,.bmp,.svg,.jfif"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          onSelectImage(file);
        }}
      />

      <div className="ap-popover-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="ap-popover-title">Appearance</span>
          <span className="ap-theme-pill">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
        </div>
        <button type="button" className="ap-reset-btn" onClick={reset} title="Reset to CoreDesk defaults">
          <Icon name="undo" size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* MODE */}
      <div className="ap-section">
        <div className="ap-label">Theme Mode</div>
        <div className="ap-segmented">
          <button
            type="button"
            className={`ap-segment-btn ${appearance.mode === 'dark' ? 'is-active' : ''}`}
            onClick={() => patch({ mode: 'dark', theme: 'dark' })}
          >
            Dark
          </button>
          <button
            type="button"
            className={`ap-segment-btn ${appearance.mode === 'light' ? 'is-active' : ''}`}
            onClick={() => patch({ mode: 'light', theme: 'light' })}
          >
            Light
          </button>
          <button
            type="button"
            className={`ap-segment-btn ${appearance.mode === 'system' ? 'is-active' : ''}`}
            onClick={() => patch({ mode: 'system' })}
          >
            System
          </button>
        </div>
      </div>

      {/* SURFACE */}
      <div className="ap-section">
        <div className="ap-label">Surface Material</div>
        <div className="ap-segmented">
          {(['graphite', 'deep', 'soft'] as SurfaceMode[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`ap-segment-btn ${appearance.surface === s ? 'is-active' : ''}`}
              onClick={() => patch({ surface: s })}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ACCENT */}
      <div className="ap-section">
        <div className="ap-label">Accent Color</div>
        <div className="ap-accent-swatches">
          {ACCENTS.map((acc) => (
            <button
              key={acc.id}
              type="button"
              className={`ap-swatch-btn ${appearance.accent === acc.value ? 'is-active' : ''}`}
              style={{ background: acc.value }}
              title={acc.label}
              onClick={() => patch({ accent: acc.value })}
            />
          ))}
        </div>
      </div>

      {/* BACKGROUND */}
      <div className="ap-section">
        <div className="ap-label">Atmospheric Background</div>
        <div className="ap-segmented">
          {(['none', 'gradient', 'image'] as BackgroundType[]).map((bg) => (
            <button
              key={bg}
              type="button"
              className={`ap-segment-btn ${appearance.background === bg ? 'is-active' : ''}`}
              onClick={() => {
                patch({
                  background: bg,
                  wallpaper: bg === 'image' ? (appearance.wallpaper || DEFAULT_WALLPAPER) : appearance.wallpaper,
                });
              }}
            >
              {bg.charAt(0).toUpperCase() + bg.slice(1)}
            </button>
          ))}
        </div>

        {appearance.background === 'image' && (
          <div className="ap-image-subpanel">
            {/* Curated Presets */}
            <div className="ap-preset-gallery">
              {WALLPAPER_PRESETS.map((preset) => {
                const isSelected =
                  !isCustom &&
                  (appearance.wallpaper === preset.dataUrl ||
                    (!appearance.wallpaper && preset.dataUrl === DEFAULT_WALLPAPER));
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`ap-preset-card ${isSelected ? 'is-active' : ''}`}
                    onClick={() => patch({ wallpaper: preset.dataUrl, background: 'image' })}
                    title={`Use ${preset.name} wallpaper`}
                  >
                    <div
                      className="ap-preset-preview"
                      style={{ backgroundImage: `url("${preset.dataUrl}")` }}
                    />
                    <span className="ap-preset-name">{preset.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Image Section */}
            {isCustom ? (
              <div className="ap-custom-row">
                <div
                  className="ap-custom-thumb"
                  style={{ backgroundImage: `url("${appearance.wallpaper}")` }}
                />
                <div className="ap-custom-info">
                  <span className="ap-custom-title">Custom Image</span>
                  <span className="ap-custom-sub">Optimized</span>
                </div>
                <button
                  type="button"
                  className="ap-icon-action-btn"
                  title="Change image"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="attachment" size={13} />
                </button>
                <button
                  type="button"
                  className="ap-icon-action-btn"
                  title="Reset to preset"
                  onClick={() => patch({ wallpaper: DEFAULT_WALLPAPER, background: 'image' })}
                >
                  <Icon name="close" size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="ap-file-btn mt-6"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="attachment" size={13} />
                <span>{isProcessing ? 'Processing image…' : 'Upload custom image…'}</span>
              </button>
            )}

            {uploadError && <div className="ap-error-text">{uploadError}</div>}
          </div>
        )}
      </div>

      <div className="ap-divider" />

      {/* SLIDERS: Blur, Dim, Vibrancy */}
      <div className="ap-sliders">
        <div className={`ap-slider-row ${appearance.background === 'none' ? 'is-disabled' : ''}`}>
          <div className="ap-slider-label">
            <span>Atmospheric Blur</span>
            <span className="ap-slider-num">{appearance.blur}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            disabled={appearance.background === 'none'}
            value={appearance.blur}
            onChange={(e) => patch({ blur: Number(e.target.value) })}
          />
        </div>

        <div className={`ap-slider-row ${appearance.background === 'none' ? 'is-disabled' : ''}`}>
          <div className="ap-slider-label">
            <span>Dim / Scrim</span>
            <span className="ap-slider-num">{appearance.dim}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            disabled={appearance.background === 'none'}
            value={appearance.dim}
            onChange={(e) => patch({ dim: Number(e.target.value) })}
          />
        </div>

        <div className="ap-slider-row">
          <div className="ap-slider-label">
            <span>Atmospheric Vibrancy</span>
            <span className="ap-slider-num">{appearance.vibrancy}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={appearance.vibrancy}
            onChange={(e) => patch({ vibrancy: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
