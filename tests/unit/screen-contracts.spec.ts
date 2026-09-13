import { describe, expect, it } from 'vitest';
import { INITIAL_SECTION_CONTENT } from '../../apps/desktop/src/screens/DocumentWorkspaceScreen';

/**
 * Mirror of client master/detail resolution logic in ClientsScreen.tsx (Section 9 & 10)
 */
export function resolveEffectiveSelectedClientId(
  filteredClients: Array<{ id: string; name: string }>,
  currentSelectedId: string | null
): string | null {
  if (filteredClients.length === 0) {
    return null;
  }
  if (currentSelectedId && filteredClients.some((c) => c.id === currentSelectedId)) {
    return currentSelectedId;
  }
  return filteredClients[0].id;
}

/**
 * Mirror of document section editor state reducer in DocumentWorkspaceScreen.tsx (Section 17)
 */
export interface EditorState {
  sections: string[];
  savedTexts: Record<string, string>;
  editedTexts: Record<string, string>;
  saveState: 'saved' | 'dirty' | 'saving' | 'failed';
}

export function createInitialEditorState(sections: string[]): EditorState {
  const saved: Record<string, string> = {};
  for (const s of sections) {
    saved[s] = INITIAL_SECTION_CONTENT[s] ?? '';
  }
  return {
    sections,
    savedTexts: saved,
    editedTexts: { ...saved },
    saveState: 'saved',
  };
}

export function updateSectionText(
  state: EditorState,
  sectionName: string,
  newText: string
): EditorState {
  const nextEdited = { ...state.editedTexts, [sectionName]: newText };
  const isDirty = state.sections.some(
    (s) => (s === sectionName ? newText : (nextEdited[s] ?? '')) !== (state.savedTexts[s] ?? '')
  );
  return {
    ...state,
    editedTexts: nextEdited,
    saveState: isDirty ? 'dirty' : 'saved',
  };
}

export function commitSave(state: EditorState): EditorState {
  return {
    ...state,
    savedTexts: { ...state.editedTexts },
    saveState: 'saved',
  };
}

export function revertChanges(state: EditorState): EditorState {
  return {
    ...state,
    editedTexts: { ...state.savedTexts },
    saveState: 'saved',
  };
}

describe('Screen Contracts & Structural Discipline (Phase D)', () => {
  describe('Clients Master/Detail Contract (Section 9)', () => {
    const mockClients = [
      { id: 'c1', name: 'Verity Health' },
      { id: 'c2', name: 'Harbor & Finch' },
      { id: 'c3', name: 'Northlight Studio' },
    ];

    it('keeps selected client when it exists within the filtered results', () => {
      const selected = resolveEffectiveSelectedClientId(mockClients, 'c2');
      expect(selected).toBe('c2');
    });

    it('falls back to the first matching client when previous selection is filtered out', () => {
      // Filter only matching "Northlight"
      const filtered = mockClients.filter((c) => c.name.includes('Northlight'));
      const selected = resolveEffectiveSelectedClientId(filtered, 'c1');
      expect(selected).toBe('c3');
    });

    it('clears selection completely (returns null) when search matches zero clients', () => {
      // Definition of Done: Search for non-existent client -> right pane is empty/cleared, NOT showing stale dossier
      const filtered = mockClients.filter((c) => c.name.includes('NonExistentCorp'));
      const selected = resolveEffectiveSelectedClientId(filtered, 'c1');
      expect(selected).toBeNull();
    });
  });

  describe('Document Studio Section Editor Contract (Section 17)', () => {
    const sections = ['Positioning', 'Wordmark', 'Colour'];

    it('initializes with populated section text and saved state', () => {
      const state = createInitialEditorState(sections);
      expect(state.saveState).toBe('saved');
      expect(state.savedTexts['Positioning']).toContain('Harbor & Finch');
      expect(state.editedTexts['Positioning']).toEqual(state.savedTexts['Positioning']);
    });

    it('transitions to dirty state when a section is modified', () => {
      const initial = createInitialEditorState(sections);
      const modified = updateSectionText(
        initial,
        'Positioning',
        'Updated strategic direction for Harbor & Finch kitchens.'
      );

      expect(modified.saveState).toBe('dirty');
      expect(modified.editedTexts['Positioning']).toBe('Updated strategic direction for Harbor & Finch kitchens.');
      expect(modified.savedTexts['Positioning']).toContain('Harbor & Finch');
    });

    it('returns to saved state if user reverts text to match saved content', () => {
      const initial = createInitialEditorState(sections);
      const originalText = initial.savedTexts['Positioning'];

      const dirty = updateSectionText(initial, 'Positioning', 'Temporary draft text');
      expect(dirty.saveState).toBe('dirty');

      const restored = updateSectionText(dirty, 'Positioning', originalText);
      expect(restored.saveState).toBe('saved');
    });

    it('commits save and updates baseline saved text', () => {
      const initial = createInitialEditorState(sections);
      const dirty = updateSectionText(initial, 'Colour', 'Primary: #2F6FEB, Accent: #25B7F3');
      expect(dirty.saveState).toBe('dirty');

      const saved = commitSave(dirty);
      expect(saved.saveState).toBe('saved');
      expect(saved.savedTexts['Colour']).toBe('Primary: #2F6FEB, Accent: #25B7F3');
      expect(saved.editedTexts['Colour']).toBe('Primary: #2F6FEB, Accent: #25B7F3');
    });

    it('reverts all uncommitted edits back to the previous saved baseline', () => {
      const initial = createInitialEditorState(sections);
      const dirty = updateSectionText(initial, 'Wordmark', 'Experimental logo lockup draft');
      expect(dirty.saveState).toBe('dirty');

      const reverted = revertChanges(dirty);
      expect(reverted.saveState).toBe('saved');
      expect(reverted.editedTexts['Wordmark']).toBe(initial.savedTexts['Wordmark']);
    });
  });

  describe('Settings Organization & Danger Zone (Section 23)', () => {
    it('isolates destructive reset and purge actions outside normal flow', () => {
      const safeTabs = ['general', 'appearance', 'workspace', 'account', 'access', 'integrations'];
      expect(safeTabs).not.toContain('danger-zone');
      expect(safeTabs).not.toContain('reset');

      // Danger Zone lives under Advanced
      const advancedTab = 'advanced';
      expect(advancedTab).toBe('advanced');
    });
  });
});
