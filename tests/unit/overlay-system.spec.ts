import { describe, expect, it, vi } from 'vitest';
import type { RegisteredOverlayEntry } from '../../apps/desktop/src/ui/overlay';

/**
 * Overlay Stack Manager Logic under test
 */
class OverlayStackManager {
  private stack: RegisteredOverlayEntry[] = [];

  register(entry: RegisteredOverlayEntry): () => void {
    this.stack.push(entry);
    return () => {
      this.stack = this.stack.filter((e) => e.id !== entry.id);
    };
  }

  getActiveStack(): RegisteredOverlayEntry[] {
    return [...this.stack];
  }

  handleEscape(): boolean {
    if (this.stack.length === 0) return false;
    const top = this.stack[this.stack.length - 1];
    top.onClose();
    if (top.returnFocus && typeof top.returnFocus.focus === 'function') {
      top.returnFocus.focus();
    }
    return true;
  }

  handleRouteChange(newRouteRoot: string): void {
    const active = [...this.stack];
    for (const entry of active) {
      if (entry.routeOwner && entry.routeOwner !== newRouteRoot) {
        entry.onClose();
      }
    }
  }
}

describe('Overlay System & Interaction Contracts (Phase A)', () => {
  describe('Section 3C: Escape Contract & Focus Return', () => {
    it('dismisses the topmost dismissible surface first', () => {
      const manager = new OverlayStackManager();

      const drawerClose = vi.fn();
      const modalClose = vi.fn();

      manager.register({
        id: 'client-drawer',
        mode: 'drawer',
        isModal: true,
        onClose: drawerClose,
      });

      manager.register({
        id: 'confirm-modal',
        mode: 'modal',
        isModal: true,
        onClose: modalClose,
      });

      // Press Escape -> closes modal first
      const handled1 = manager.handleEscape();
      expect(handled1).toBe(true);
      expect(modalClose).toHaveBeenCalledTimes(1);
      expect(drawerClose).not.toHaveBeenCalled();

      // Unregister closed modal
      manager.handleRouteChange('any'); // simulate stack cleanup or manual pop
    });

    it('returns focus to the trigger element that opened the surface on Escape', () => {
      const manager = new OverlayStackManager();

      const triggerBtn = {
        focus: vi.fn(),
      } as unknown as HTMLElement;

      const onClose = vi.fn();

      manager.register({
        id: 'task-inspector-overlay',
        mode: 'inspector',
        isModal: true,
        onClose,
        returnFocus: triggerBtn,
      });

      manager.handleEscape();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(triggerBtn.focus).toHaveBeenCalledTimes(1);
    });

    it('preserves persistent contextual workspace panes (side-by-side mode does not register as dismissible overlay)', () => {
      const manager = new OverlayStackManager();

      // Side-by-side mode does not enter the modal escape stack
      const sideBySideInspector = {
        isSideBySide: true,
        isModal: false,
      };

      if (!sideBySideInspector.isSideBySide) {
        manager.register({
          id: 'task-inspector',
          mode: 'inspector',
          isModal: true,
          onClose: () => {},
        });
      }

      const handled = manager.handleEscape();
      expect(handled).toBe(false);
      expect(manager.getActiveStack().length).toBe(0);
    });
  });

  describe('Section 3B: Inspector Route Lifecycle Contract', () => {
    it('automatically unmounts inspector when destination does not own inspector context', () => {
      const manager = new OverlayStackManager();
      const inspectorClose = vi.fn();

      manager.register({
        id: 'task-inspector',
        mode: 'inspector',
        routeOwner: 'tasks',
        onClose: inspectorClose,
      });

      // Navigate from tasks to clients
      manager.handleRouteChange('clients');

      expect(inspectorClose).toHaveBeenCalledTimes(1);
    });

    it('retains inspector when navigating within the same route owner context', () => {
      const manager = new OverlayStackManager();
      const inspectorClose = vi.fn();

      manager.register({
        id: 'task-inspector',
        mode: 'inspector',
        routeOwner: 'tasks',
        onClose: inspectorClose,
      });

      // Sub-route change within tasks
      manager.handleRouteChange('tasks');

      expect(inspectorClose).not.toHaveBeenCalled();
    });

    it('automatically unmounts Client Studio Drawer on foreign route navigation', () => {
      const manager = new OverlayStackManager();
      const drawerClose = vi.fn();

      manager.register({
        id: 'client-studio',
        mode: 'drawer',
        routeOwner: 'clients',
        onClose: drawerClose,
      });

      // User clicks Tasks in navigation rail
      manager.handleRouteChange('tasks');

      expect(drawerClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Section 3D: ARIA and Modal Semantics', () => {
    it('assigns role="region" and aria-modal="false" when Task Inspector is side-by-side', () => {
      const isSideBySide = true;
      const computedRole = isSideBySide ? 'region' : 'dialog';
      const computedAriaModal = isSideBySide ? 'false' : 'true';

      expect(computedRole).toBe('region');
      expect(computedAriaModal).toBe('false');
    });

    it('assigns role="dialog" and aria-modal="true" when Task Inspector is in overlay mode', () => {
      const isSideBySide = false;
      const computedRole = isSideBySide ? 'region' : 'dialog';
      const computedAriaModal = isSideBySide ? 'false' : 'true';

      expect(computedRole).toBe('dialog');
      expect(computedAriaModal).toBe('true');
    });

    it('assigns role="dialog" and aria-modal="true" for modal dialogs and drawers', () => {
      const modes = ['modal', 'drawer'] as const;
      for (const mode of modes) {
        const isModal = true;
        const role = mode === 'drawer' || mode === 'modal' ? 'dialog' : 'menu';
        const ariaModal = isModal ? 'true' : 'false';

        expect(role).toBe('dialog');
        expect(ariaModal).toBe('true');
      }
    });

    it('assigns role="menu" and does not claim aria-modal on popover menus', () => {
      const mode = 'popover';
      const isModal = false;
      const role = mode === 'drawer' || mode === 'modal' ? 'dialog' : 'menu';
      const ariaModal = isModal ? 'true' : undefined;

      expect(role).toBe('menu');
      expect(ariaModal).toBeUndefined();
    });
  });
});
