/**
 * Popover primitive.
 *
 * Renders its children in a portal, anchored to a trigger element. Owns the
 * interaction contract — outside-click and Escape close it, focus moves in when
 * it opens and back to the trigger when it closes — so menu contents never have
 * to reimplement that.
 *
 * Positioning is deliberately simple: the popover is anchored to the trigger's
 * bounding box and clamped to the viewport. A menu that opens a long way from its
 * trigger is a context loss; keeping it adjacent is part of the point.
 */

import {
  useEffect, useId, useLayoutEffect, useRef, useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

export interface AnchorRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
}

export interface PopoverProps {
  anchor: AnchorRect | null;
  onClose: () => void;
  /** When set, Escape also returns focus here on close. */
  returnFocus?: React.RefObject<HTMLElement | null>;
  /** One or more trigger elements that toggle this popover. Clicks inside them will not trigger outside-close. */
  triggerRef?: React.RefObject<HTMLElement | null> | Array<React.RefObject<HTMLElement | null>>;
  align?: 'start' | 'end';
  children: ReactNode;
  className?: string;
  /** Label for the menu, announced to assistive tech. */
  label: string;
}

export function Popover({
  anchor, onClose, returnFocus, triggerRef, align = 'start', children, className, label,
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const titleId = useId();

  /* Measure once on open so the panel is placed before it paints, and focus it
     so keyboard users are immediately inside the menu. Both must happen in the
     same layout effect: focusing in a separate effect runs before the portal has
     mounted the panel, and the focus is lost. */
  useLayoutEffect(() => {
    if (!anchor || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const MARGIN = 6;

    let left = align === 'end' ? anchor.right - rect.width : anchor.left;
    let top = anchor.bottom + MARGIN;

    /* Clamp to the viewport. A menu that falls off-screen is a worse failure
       than one that opens slightly offset. */
    left = Math.max(MARGIN, Math.min(left, window.innerWidth - rect.width - MARGIN));
    const flipped = top + rect.height > window.innerHeight - MARGIN;
    top = flipped ? anchor.top - rect.height - MARGIN : top;
    top = Math.max(MARGIN, top);

    setPos({ left, top });
    /* Focus must be deferred past the browser's own post-click focus restore:
       clicking the trigger re-focuses it after React's effects run, so focusing
       the panel synchronously here is immediately overwritten. A rAF lands after
       that restore. */
    const panel = panelRef.current;
    requestAnimationFrame(() => panel?.focus());
  }, [anchor, align]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!target) return;
      if (panel.contains(target)) return;

      const triggers = Array.isArray(triggerRef)
        ? triggerRef
        : [triggerRef ?? returnFocus];

      const isTriggerClick = triggers.some((ref) => {
        const el = ref?.current;
        return el ? (el === target || el.contains(target)) : false;
      });

      if (isTriggerClick) return;

      onClose();
    };

    window.addEventListener('keydown', onKey, true);
    window.addEventListener('pointerdown', onPointer, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('pointerdown', onPointer, true);
    };
  }, [onClose, triggerRef, returnFocus]);

  /* Return focus to the trigger when the menu closes. */
  useEffect(() => {
    return () => {
      const el = returnFocus?.current;
      el?.focus?.();
    };
  }, [returnFocus]);

  /* The panel must be mounted before it can be measured, but it must not be
     seen before it is measured. It starts off-screen (visibility hidden) so the
     layout effect can read its size, then paints at the clamped position. The
     previous version returned null when `pos` was unknown, which meant the
     layout effect that sets `pos` never ran — the menu could never open. */
  if (!anchor) return null;

  return createPortal(
    <div
      ref={panelRef}
      role="menu"
      aria-label={label}
      aria-labelledby={titleId}
      tabIndex={-1}
      className={className ? `cd-popover ${className}` : 'cd-popover'}
      style={
        pos
          ? { left: pos.left, top: pos.top, visibility: 'visible' }
          : { left: -9999, top: -9999, visibility: 'hidden' }
      }
      onClick={(e) => e.stopPropagation()}
    >
      <span id={titleId} hidden>
        {label}
      </span>
      {children}
    </div>,
    document.body
  );
}
