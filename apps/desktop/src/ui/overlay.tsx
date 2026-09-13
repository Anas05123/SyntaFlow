/**
 * Overlay host & Unified Overlay Surface.
 *
 * Central overlay management supporting modals, popovers, menus, drawers,
 * and contextual inspectors. Enforces:
 * - Centralized Escape dismissal stack (unwinds one layer at a time from top to bottom)
 * - Focus entry, trapping (for modal/drawer surfaces), and guaranteed focus return to triggers
 * - Strict ARIA semantics (aria-modal="true" only for focus-trapping blocking overlays)
 * - Route-aware lifecycle (contextual inspectors and drawers automatically dismiss on foreign navigation)
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { Icon, type IconName } from './Icon';
import { IconButton } from './primitives';

/* -------------------------------------------------------------------------- */
/* Toasts                                                                      */
/* -------------------------------------------------------------------------- */

export type ToastTone = 'default' | 'ok' | 'warn' | 'bad';

interface ToastRecord {
  id: number;
  title: string;
  body?: string;
  tone: ToastTone;
}

const TOAST_ICON: Record<ToastTone, IconName> = {
  default: 'clock',
  ok: 'checkCircle',
  warn: 'clock',
  bad: 'alert',
};

/* -------------------------------------------------------------------------- */
/* Overlay Types & Stack Entry                                                */
/* -------------------------------------------------------------------------- */

export type OverlayMode = 'menu' | 'popover' | 'modal' | 'drawer' | 'inspector';

export interface RegisteredOverlayEntry {
  id: string;
  mode: OverlayMode;
  isModal?: boolean;
  onClose: () => void;
  returnFocus?: HTMLElement | null;
  routeOwner?: string;
}

export interface OverlayApi {
  toast: (title: string, body?: string, tone?: ToastTone) => void;
  /** Open a task or record in the right-hand slide-over panel. */
  openTask: (taskId: string, triggerElement?: HTMLElement | null) => void;
  closePanel: () => void;
  panelTaskId: string | null;
  isPanelSideBySide: boolean;
  setIsPanelSideBySide: (sideBySide: boolean) => void;
  /** Modal stack. `id` carries the record the modal acts on. */
  openModal: (kind: string, id?: string, triggerElement?: HTMLElement | null) => void;
  closeModal: () => void;
  modal: { kind: string; id?: string } | null;
  searchOpen: boolean;
  openSearch: (triggerElement?: HTMLElement | null) => void;
  closeSearch: () => void;
  /** Register an active overlay with the central Escape and route lifecycle stack */
  registerOverlay: (entry: RegisteredOverlayEntry) => () => void;
}

const OverlayContext = createContext<OverlayApi | null>(null);

export function useOverlay(): OverlayApi {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used inside <OverlayProvider>');
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Helper: Focus Trapping                                                      */
/* -------------------------------------------------------------------------- */

const FOCUSABLE_SELECTOR =
  'button:not([disabled]):not([aria-hidden="true"]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapFocusInContainer(container: HTMLElement, e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;
  const focusables = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);

  if (focusables.length === 0) {
    e.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first || !container.contains(document.activeElement)) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last || !container.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  }
}

/* -------------------------------------------------------------------------- */
/* OverlaySurface Primitive                                                   */
/* -------------------------------------------------------------------------- */

export interface OverlaySurfaceProps {
  id?: string;
  mode?: OverlayMode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  returnFocusRef?: React.RefObject<HTMLElement | null> | HTMLElement | null;
  triggerRef?:
    | React.RefObject<HTMLElement | null>
    | HTMLElement
    | null
    | Array<React.RefObject<HTMLElement | null> | HTMLElement | null>;
  className?: string;
  isModal?: boolean;
  routeOwner?: string;
  trapFocus?: boolean;
  dimBackground?: boolean;
  scrimTone?: 'normal' | 'soft';
  portal?: boolean;
  style?: React.CSSProperties;
  onClickScrim?: () => void;
  role?: string;
}

export function OverlaySurface({
  id,
  mode = 'modal',
  isOpen,
  onClose,
  children,
  ariaLabel,
  ariaLabelledBy,
  returnFocusRef,
  triggerRef,
  className,
  isModal,
  routeOwner,
  trapFocus = true,
  dimBackground = true,
  scrimTone = 'normal',
  portal = true,
  style,
  onClickScrim,
  role,
}: OverlaySurfaceProps) {
  const overlay = useContext(OverlayContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const internalId = useRef(id || `surface-${Math.random().toString(36).slice(2, 9)}`);
  const initialTriggerRef = useRef<HTMLElement | null>(null);

  // Compute resolved modal flag: modals and drawers default to isModal=true
  const computedIsModal = isModal !== undefined ? isModal : mode === 'modal' || mode === 'drawer';

  // Determine return focus target element
  const resolveReturnFocus = useCallback((): HTMLElement | null => {
    if (returnFocusRef) {
      if ('current' in returnFocusRef) return returnFocusRef.current;
      return returnFocusRef;
    }
    if (triggerRef) {
      if (Array.isArray(triggerRef)) {
        const first = triggerRef[0];
        if (first && 'current' in first) return first.current;
        return (first as HTMLElement) || null;
      }
      if ('current' in triggerRef) return triggerRef.current;
      return triggerRef;
    }
    return initialTriggerRef.current;
  }, [returnFocusRef, triggerRef]);

  // Capture active element right as overlay opens
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      if (!initialTriggerRef.current && document.activeElement instanceof HTMLElement) {
        initialTriggerRef.current = document.activeElement;
      }
    } else {
      initialTriggerRef.current = null;
    }
  }, [isOpen]);

  // Register with overlay stack
  useEffect(() => {
    if (!isOpen || !overlay) return;
    const unregister = overlay.registerOverlay({
      id: internalId.current,
      mode,
      isModal: computedIsModal,
      onClose,
      returnFocus: resolveReturnFocus(),
      routeOwner,
    });
    return () => unregister();
  }, [isOpen, overlay, mode, computedIsModal, onClose, resolveReturnFocus, routeOwner]);

  // Focus entry and Tab trap
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    // Focus first element or container
    const focusTarget = () => {
      const auto = container.querySelector<HTMLElement>('[autofocus], [data-autofocus]');
      if (auto) {
        auto.focus();
        return;
      }
      const first = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (first) {
        first.focus();
        return;
      }
      container.focus();
    };

    const rAf = requestAnimationFrame(focusTarget);

    const onKeyDown = (e: KeyboardEvent) => {
      if (trapFocus && computedIsModal) {
        trapFocusInContainer(container, e);
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(rAf);
      container.removeEventListener('keydown', onKeyDown);
      const target = resolveReturnFocus();
      target?.focus?.();
    };
  }, [isOpen, trapFocus, computedIsModal, resolveReturnFocus]);

  if (!isOpen) return null;

  const resolvedRole =
    role ||
    (mode === 'drawer' || mode === 'modal'
      ? 'dialog'
      : mode === 'inspector'
      ? computedIsModal
        ? 'dialog'
        : 'region'
      : 'menu');

  const content = (
    <>
      {dimBackground && (
        <div
          className={`scrim ${scrimTone === 'soft' ? 'soft' : ''}`}
          onClick={onClickScrim || onClose}
          aria-hidden="true"
        />
      )}
      <div
        ref={containerRef}
        role={resolvedRole}
        aria-modal={computedIsModal ? 'true' : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        className={className}
        style={style}
        onClick={(e) => {
          if (e.target === containerRef.current) {
            (onClickScrim || onClose)();
          }
        }}
      >
        {children}
      </div>
    </>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                    */
/* -------------------------------------------------------------------------- */

function getRouteRoot(): string {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '') || 'home';
  return raw.split('/')[0] || 'home';
}

export function OverlayProvider({
  children, renderPanel, renderModal, renderSearch,
}: {
  children: ReactNode;
  renderPanel: (taskId: string, isSideBySide?: boolean) => ReactNode;
  renderModal: (kind: string, id?: string) => ReactNode;
  renderSearch: () => ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [panelTaskId, setPanelTaskId] = useState<string | null>(null);
  const [isPanelSideBySide, setIsPanelSideBySide] = useState(false);
  const [modal, setModal] = useState<{ kind: string; id?: string } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const panelTrigger = useRef<HTMLElement | null>(null);
  const panelRouteOwner = useRef<string | null>(null);
  const searchTrigger = useRef<HTMLElement | null>(null);
  const modalTrigger = useRef<HTMLElement | null>(null);

  const overlayStack = useRef<RegisteredOverlayEntry[]>([]);
  const seq = useRef(0);

  const toast = useCallback((title: string, body?: string, tone: ToastTone = 'default') => {
    seq.current += 1;
    const id = seq.current;
    setToasts((list) => [...list, { id, title, body, tone }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 5200);
  }, []);

  const closePanel = useCallback(() => {
    setPanelTaskId(null);
    panelRouteOwner.current = null;
    const trigger = panelTrigger.current;
    if (trigger) {
      panelTrigger.current = null;
      requestAnimationFrame(() => trigger.focus?.());
    }
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    const trigger = modalTrigger.current;
    if (trigger) {
      modalTrigger.current = null;
      requestAnimationFrame(() => trigger.focus?.());
    }
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    const trigger = searchTrigger.current;
    if (trigger) {
      searchTrigger.current = null;
      requestAnimationFrame(() => trigger.focus?.());
    }
  }, []);

  const openTask = useCallback((taskId: string, triggerElement?: HTMLElement | null) => {
    panelTrigger.current = triggerElement || (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement ? document.activeElement : null);
    panelRouteOwner.current = getRouteRoot();
    setPanelTaskId((current) => (current === taskId ? null : taskId));
  }, []);

  const openModal = useCallback((kind: string, id?: string, triggerElement?: HTMLElement | null) => {
    modalTrigger.current = triggerElement || (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setModal({ kind, id });
  }, []);

  const openSearch = useCallback((triggerElement?: HTMLElement | null) => {
    searchTrigger.current = triggerElement || (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setSearchOpen(true);
  }, []);

  const registerOverlay = useCallback((entry: RegisteredOverlayEntry) => {
    overlayStack.current.push(entry);
    return () => {
      overlayStack.current = overlayStack.current.filter((e) => e.id !== entry.id);
    };
  }, []);

  /* Central Route-Aware Lifecycle Handler */
  useEffect(() => {
    const handleRouteChange = () => {
      const currentRoot = getRouteRoot();

      // Automatically unmount Task Inspector if route leaves its owner
      if (panelTaskId && panelRouteOwner.current && panelRouteOwner.current !== currentRoot) {
        closePanel();
      }

      // Check all registered overlays with routeOwner
      const activeEntries = [...overlayStack.current];
      for (const entry of activeEntries) {
        if (entry.routeOwner && entry.routeOwner !== currentRoot) {
          entry.onClose();
        }
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, [panelTaskId, closePanel]);

  /* Central Escape & Shortcut Dispatcher */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 1. Search shortcut (Ctrl/Cmd + K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
        return;
      }

      // 2. Escape Contract (Topmost dismissible layer unwinds first)
      if (e.key === 'Escape') {
        // First check registered overlay surfaces on the stack
        if (overlayStack.current.length > 0) {
          const top = overlayStack.current[overlayStack.current.length - 1];
          e.preventDefault();
          e.stopPropagation();
          top.onClose();
          top.returnFocus?.focus?.();
          return;
        }

        // Secondary fallbacks for legacy hosts
        if (searchOpen) {
          e.preventDefault();
          e.stopPropagation();
          closeSearch();
          return;
        }
        if (modal) {
          e.preventDefault();
          e.stopPropagation();
          closeModal();
          return;
        }
        // Dismiss Task Inspector only when operating as an overlay, not when side-by-side
        if (panelTaskId && !isPanelSideBySide) {
          e.preventDefault();
          e.stopPropagation();
          closePanel();
          return;
        }
      }

      // 3. Slash shortcut for search when not typing
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.classList?.contains('input') ||
          target.getAttribute('role') === 'textbox');
      if (e.key === '/' && !searchOpen && !modal && !typing) {
        e.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [searchOpen, modal, panelTaskId, isPanelSideBySide, openSearch, closeSearch, closeModal, closePanel]);

  const api = useMemo<OverlayApi>(
    () => ({
      toast,
      openTask,
      closePanel,
      panelTaskId,
      isPanelSideBySide,
      setIsPanelSideBySide,
      openModal,
      closeModal,
      modal,
      searchOpen,
      openSearch,
      closeSearch,
      registerOverlay,
    }),
    [
      toast,
      openTask,
      closePanel,
      panelTaskId,
      isPanelSideBySide,
      openModal,
      closeModal,
      modal,
      searchOpen,
      openSearch,
      closeSearch,
      registerOverlay,
    ]
  );

  return (
    <OverlayContext.Provider value={api}>
      {children}

      {searchOpen ? (
        <>
          <div className="scrim" onClick={closeSearch} />
          {renderSearch()}
        </>
      ) : null}

      {panelTaskId ? (
        <>
          {!isPanelSideBySide && <div className="scrim soft" onClick={closePanel} />}
          {renderPanel(panelTaskId, isPanelSideBySide)}
        </>
      ) : null}

      {modal ? (
        <>
          <div className="scrim" onClick={closeModal} />
          {renderModal(modal.kind, modal.id)}
        </>
      ) : null}

      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast tone-${t.tone}`}>
            <span
              style={{
                flex: '0 0 auto',
                color: `var(--${
                  t.tone === 'ok'
                    ? 'active'
                    : t.tone === 'bad'
                    ? 'risk'
                    : t.tone === 'warn'
                    ? 'waiting'
                    : 'accent'
                })`,
              }}
            >
              <Icon name={TOAST_ICON[t.tone]} size={17} />
            </span>
            <div className="grow">
              <div className="toast-title">{t.title}</div>
              {t.body ? <div className="toast-body">{t.body}</div> : null}
            </div>
            <IconButton
              icon="close"
              label="Dismiss"
              onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
            />
          </div>
        ))}
      </div>
    </OverlayContext.Provider>
  );
}
