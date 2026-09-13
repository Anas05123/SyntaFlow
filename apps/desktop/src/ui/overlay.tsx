/**
 * Overlay host.
 *
 * One provider owns toasts, the slide-over record panel, modals and the global
 * search overlay. Screens request overlays through the `useOverlay` hook instead
 * of rendering their own, so Esc handling and scrim behaviour stay consistent.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react';

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
/* Context                                                                     */
/* -------------------------------------------------------------------------- */

export interface OverlayApi {
  toast: (title: string, body?: string, tone?: ToastTone) => void;
  /** Open a task or record in the right-hand slide-over panel. */
  openTask: (taskId: string) => void;
  closePanel: () => void;
  panelTaskId: string | null;
  /** Modal stack. `id` carries the record the modal acts on. */
  openModal: (kind: string, id?: string) => void;
  closeModal: () => void;
  modal: { kind: string; id?: string } | null;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const OverlayContext = createContext<OverlayApi | null>(null);

export function useOverlay(): OverlayApi {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used inside <OverlayProvider>');
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                    */
/* -------------------------------------------------------------------------- */

export function OverlayProvider({
  children, renderPanel, renderModal, renderSearch,
}: {
  children: ReactNode;
  renderPanel: (taskId: string) => ReactNode;
  renderModal: (kind: string, id?: string) => ReactNode;
  renderSearch: () => ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [panelTaskId, setPanelTaskId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ kind: string; id?: string } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const seq = useRef(0);

  const toast = useCallback((title: string, body?: string, tone: ToastTone = 'default') => {
    seq.current += 1;
    const id = seq.current;
    setToasts((list) => [...list, { id, title, body, tone }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 5200);
  }, []);

  const closePanel = useCallback(() => setPanelTaskId(null), []);
  const closeModal = useCallback(() => setModal(null), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const openTask = useCallback((taskId: string) => {
    setPanelTaskId((current) => (current === taskId ? null : taskId));
  }, []);

  const openModal = useCallback((kind: string, id?: string) => setModal({ kind, id }), []);

  /* Keyboard contract: Ctrl/Cmd+K opens search, Esc unwinds one layer at a time. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
        return;
      }
      if (e.key === 'Escape') {
        if (searchOpen) { setSearchOpen(false); return; }
        if (modal) { setModal(null); return; }
        if (panelTaskId) { setPanelTaskId(null); return; }
      }
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '/' && !searchOpen && !modal && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, modal, panelTaskId]);

  const api = useMemo<OverlayApi>(
    () => ({
      toast, openTask, closePanel, panelTaskId,
      openModal, closeModal, modal,
      searchOpen, openSearch: () => setSearchOpen(true), closeSearch,
    }),
    [toast, openTask, closePanel, panelTaskId, openModal, closeModal, modal, searchOpen, closeSearch]
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
          <div className="scrim soft" onClick={closePanel} />
          {renderPanel(panelTaskId)}
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
            <span style={{ flex: '0 0 auto', color: `var(--${t.tone === 'ok' ? 'active' : t.tone === 'bad' ? 'risk' : t.tone === 'warn' ? 'waiting' : 'accent'})` }}>
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
