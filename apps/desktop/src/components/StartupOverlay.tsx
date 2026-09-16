/**
 * CoreDesk Startup Transition Overlay
 * "The Continuous Thread Reconnects"
 *
 * Sequence:
 *   Phase A — Arrival (0–180ms): Near-black graphite, mark at low opacity / slight scale
 *   Phase B — Form (180–550ms): Interwoven mark resolves crisply with subtle scale & blue/cyan progression
 *   Phase C — Signal (450–900ms): Restrained blue/cyan signal travels through thread path
 *   Phase D — Ripple / Wake (700–1100ms): Concentric water ripples expand outward; workspace awakens
 *   Phase E — Handoff (1000–1300ms): Startup layer smoothly fades out revealing the prepared workspace
 *
 * Reduced Motion:
 *   Replaces motion with a gentle opacity fade.
 *
 * Recovery Surface:
 *   If critical initialization fails or times out, transitions gracefully to a calm recovery card.
 */

import { useEffect, useState } from 'react';
import { BRAND_MARK_SRC } from '../ui/brandAssets';
import { Icon } from '../ui/Icon';

export interface StartupOverlayProps {
  /** True once session is resolved and initial workspace is mounted underneath */
  ready: boolean;
  /** Set if critical startup failure occurs */
  error?: string | null;
  /** Invoked when user requests retry from recovery surface */
  onRetry?: () => void;
  /** Invoked when handoff fade finishes to unmount overlay */
  onComplete: () => void;
}

export function StartupOverlay({ ready, error = null, onRetry, onComplete }: StartupOverlayProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [animationSettled, setAnimationSettled] = useState(false);

  // Detect prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Natural brand settling: does not enforce fake artificial delay if already ready
  useEffect(() => {
    if (ready) {
      setAnimationSettled(true);
      return;
    }
    const maxSettle = prefersReducedMotion ? 120 : 350;
    const timer = setTimeout(() => {
      setAnimationSettled(true);
    }, maxSettle);
    return () => clearTimeout(timer);
  }, [ready, prefersReducedMotion]);

  // Handoff trigger: when workspace is ready, smoothly fade out without delay
  useEffect(() => {
    if (ready && animationSettled && !error && !isExiting) {
      const exitDuration = prefersReducedMotion ? 120 : 200;
      const t1 = setTimeout(() => setIsExiting(true), 16);
      const t2 = setTimeout(() => {
        onComplete();
      }, exitDuration);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [ready, animationSettled, error, isExiting, prefersReducedMotion, onComplete]);

  return (
    <div
      className={`cd-startup-layer ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-label="Syntaflow workspace startup"
      aria-live="polite"
    >
      {error ? (
        <div className="cd-startup-recovery" role="alert">
          <div className="cd-startup-recovery-icon">
            <Icon name="alert" size={20} />
          </div>
          <h2 className="cd-startup-recovery-title">Syntaflow couldn't open your workspace</h2>
          <p className="cd-startup-recovery-sub">
            Your local data has not been deleted.
            {error ? ` (${error})` : ''}
          </p>
          <div className="cd-startup-recovery-actions">
            <button
              type="button"
              className="cd-action cd-action-primary"
              onClick={onRetry || (() => window.location.reload())}
            >
              <Icon name="refresh" size={15} />
              Try again
            </button>
          </div>
        </div>
      ) : (
        <div className="cd-startup-stage">
          {/* Subtle ambient light behind mark */}
          <div className="cd-startup-ambient" aria-hidden="true" />

          {/* Water ripples expanding during workspace wake */}
          {!prefersReducedMotion && (
            <div className="cd-startup-ripples" aria-hidden="true">
              <div className="cd-startup-ripple ripple-1" />
              <div className="cd-startup-ripple ripple-2" />
            </div>
          )}

          {/* Interwoven Brand Mark with signal path overlay */}
          <div className="cd-startup-mark-box">
            <img
              src={BRAND_MARK_SRC}
              alt="Syntaflow"
              className="cd-startup-mark-img"
              draggable={false}
            />

            {!prefersReducedMotion && (
              <svg
                className="cd-startup-signal-svg"
                viewBox="0 0 120 120"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="cdStartupSignalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                    <stop offset="60%" stopColor="#38BDF8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#BAE6FD" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {/* Rounded tracking ring */}
                <circle cx="60" cy="60" r="38" className="cd-startup-signal-track" />
                {/* Restrained traveling signal */}
                <circle cx="60" cy="60" r="38" className="cd-startup-signal-pulse" />
              </svg>
            )}
          </div>

          <span className="cd-startup-label">
            {ready ? 'Workspace ready' : 'Reconnecting workspace'}
          </span>
        </div>
      )}
    </div>
  );
}
