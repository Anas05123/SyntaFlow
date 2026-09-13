/**
 * W03 · Global search overlay.
 *
 * One instance for the whole app. Results are grouped by record type, and each
 * result carries its client/project context — the Dala research note asks for
 * search that returns work with its context rather than a bare title list.
 */

import { useMemo, useState, useEffect, useRef } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { Icon, type IconName } from '../ui/Icon';
import { Button } from '../ui/primitives';

interface Hit {
  title: string;
  sub: string;
  href?: string;
  icon: IconName;
  taskId?: string;
  action?: () => void;
}

interface Group {
  label: string;
  items: Hit[];
}

export function SearchPalette() {
  const { state, derived } = useStore();
  const overlay = useOverlay();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const COMMANDS: Hit[] = useMemo(
    () => [
      {
        title: 'Create project',
        sub: 'Command · Start a new client project engagement',
        icon: 'projects',
        action: () => navigate('#/new-project'),
      },
      {
        title: 'Create client',
        sub: 'Command · Add a new client relationship',
        icon: 'clients',
        action: () => overlay.openModal('new-client'),
      },
      {
        title: 'Create task',
        sub: 'Command · Add a new operational task',
        icon: 'tasks',
        action: () => overlay.openModal('new-task'),
      },
      {
        title: 'Create document',
        sub: 'Command · Draft a proposal, agreement or brief',
        icon: 'documents',
        action: () => overlay.openModal('new-document'),
      },
      {
        title: 'Open workspace settings',
        sub: 'Command · Configure workspace and profile',
        icon: 'settings',
        action: () => navigate('#/settings/account'),
      },
      {
        title: 'Go to Home',
        sub: 'Command · Operational workspace overview',
        icon: 'home',
        action: () => navigate('#/home'),
      },
      {
        title: 'Go to Activity',
        sub: 'Command · Audit log of reviews and decisions',
        icon: 'activity',
        action: () => navigate('#/activity'),
      },
    ],
    [overlay]
  );

  const groups = useMemo<Group[]>(() => {
    const q = query.trim().toLowerCase();
    if (q === '') {
      return [
        {
          label: 'Commands',
          items: COMMANDS.slice(0, 4),
        },
        {
          label: 'Clients',
          items: state.clients.slice(0, 2).map((c) => ({
            title: c.name,
            sub: `${c.contacts[0]?.name ?? 'No contact'} · ${c.state}`,
            href: `#/clients/${c.id}`,
            icon: 'clients' as IconName,
          })),
        },
        {
          label: 'Projects',
          items: state.projects.slice(0, 2).map((p) => ({
            title: p.name,
            sub: `${derived.clientById(p.clientId)?.name ?? ''} · ${p.stage}`,
            href: `#/projects/${p.id}`,
            icon: 'projects' as IconName,
          })),
        },
        {
          label: 'Documents',
          items: state.documents.slice(0, 2).map((d) => ({
            title: d.title,
            sub: `Document · ${d.type} · working v${d.workingVersion}`,
            href: `#/documents/${d.id}`,
            icon: 'documents' as IconName,
          })),
        },
      ];
    }

    const out: Group[] = [];

    // Filter matching commands
    const matchingCommands = COMMANDS.filter(
      (cmd) => cmd.title.toLowerCase().includes(q) || cmd.sub.toLowerCase().includes(q)
    );
    if (matchingCommands.length) {
      out.push({ label: 'Commands', items: matchingCommands });
    }

    const clients = state.clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.contacts.some((ct) => ct.name.toLowerCase().includes(q) || ct.email.toLowerCase().includes(q))
    );
    if (clients.length) {
      out.push({
        label: 'Clients',
        items: clients.map((c) => ({
          title: c.name,
          sub: `${c.contacts[0]?.name ?? 'No contact'} · ${c.state}`,
          href: `#/clients/${c.id}`,
          icon: 'clients',
        })),
      });
    }

    const projects = state.projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.outcome.toLowerCase().includes(q)
    );
    if (projects.length) {
      out.push({
        label: 'Projects',
        items: projects.map((p) => ({
          title: p.name,
          sub: `${derived.clientById(p.clientId)?.name ?? ''} · ${p.stage}`,
          href: `#/projects/${p.id}`,
          icon: 'projects',
        })),
      });
    }

    const documents = state.documents.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        `v${d.workingVersion}`.includes(q) ||
        `v${d.submittedVersion}`.includes(q)
    );
    if (documents.length) {
      out.push({
        label: 'Documents',
        items: documents.map((d) => ({
          title: d.title,
          sub: `${d.type} · working v${d.workingVersion}`,
          href: `#/documents/${d.id}`,
          icon: 'documents',
        })),
      });
    }

    const tasks = derived.tasksWithContext.filter((t) => t.title.toLowerCase().includes(q));
    if (tasks.length) {
      out.push({
        label: 'Tasks',
        items: tasks.slice(0, 5).map((t) => ({
          title: t.title,
          sub: t.contextLabel,
          href: t.contextHref,
          icon: 'tasks',
          taskId: t.id,
        })),
      });
    }

    return out;
  }, [query, state, derived, COMMANDS]);

  const flat = groups.flatMap((g) => g.items);
  const open = (hit: Hit) => {
    overlay.closeSearch();
    if (hit.action) {
      hit.action();
      return;
    }
    if (hit.taskId) overlay.openTask(hit.taskId);
    if (hit.href) navigate(hit.href);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, Math.max(flat.length - 1, 0)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === 'Enter' && flat[cursor]) {
        e.preventDefault();
        open(flat[cursor]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => setCursor(0), [query]);

  let index = -1;

  return (
    <div className="overlay-center">
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search workspace">
        <div className="field-search">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, projects, documents, tasks…"
            aria-label="Search query"
            autoComplete="off"
          />
          <span className="kbd">Esc</span>
        </div>

        <div className="palette-results">
          {flat.length === 0 ? (
            <div className="state">
              <span className="state-icon"><Icon name="search" size={20} /></span>
              <div className="state-title">No results</div>
              <p className="state-text">
                Nothing in your workspace matches “{query}”. Archived records are excluded unless you opt in.
              </p>
              <div className="state-actions">
                <Button size="sm" onClick={() => { window.location.hash = '#/archive'; overlay.closeSearch(); }}>
                  Search the archive
                </Button>
              </div>
            </div>
          ) : (
            groups.map((g) => (
              <div key={g.label}>
                <div className="palette-group-label">{g.label} · {g.items.length}</div>
                {g.items.map((hit) => {
                  index += 1;
                  const selected = index === cursor;
                  return (
                    <button
                      type="button"
                      key={`${g.label}-${hit.title}`}
                      className="palette-item"
                      aria-selected={selected}
                      onMouseEnter={() => setCursor(flat.indexOf(hit))}
                      onClick={() => open(hit)}
                    >
                      <Icon name={hit.icon} size={17} />
                      <span className="palette-item-text">
                        <span className="palette-item-title">{hit.title}</span>
                        <span className="palette-item-sub">{hit.sub}</span>
                      </span>
                      <Icon name="chevronRight" size={15} />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="palette-foot">
          <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span className="grow" />
          <span>Only authorized records appear</span>
        </div>
      </div>
    </div>
  );
}
