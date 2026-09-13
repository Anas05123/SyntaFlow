/**
 * The global Create menu.
 *
 * One trigger, four actions. It replaces the permanent "New client / New project
 * / New document / New task" buttons that would otherwise crowd the command bar,
 * and gives each action a keyboard route. Availability can vary by context later;
 * for now it is the same everywhere because the object model owns the rest.
 */

import { useOverlay } from '../ui/overlay';
import { navigate, useRoute } from '../app/router';
import { Icon, type IconName } from '../ui/Icon';

interface CreateAction {
  id: string;
  label: string;
  shortcut: string;
  icon: IconName;
  run: () => void;
}

export function CreateMenu({ onClose }: { onClose: () => void }) {
  const overlay = useOverlay();
  const route = useRoute();

  const isProject = route.segments[0] === 'projects' && Boolean(route.params.project);
  const isClient = route.segments[0] === 'clients' && Boolean(route.params.client);

  let actions: CreateAction[] = [];

  if (isProject) {
    actions = [
      {
        id: 'task',
        label: 'New task',
        shortcut: 'T',
        icon: 'tasks',
        run: () => {
          onClose();
          overlay.openModal('new-task', route.params.project);
        },
      },
      {
        id: 'document',
        label: 'New document',
        shortcut: 'D',
        icon: 'documents',
        run: () => {
          onClose();
          overlay.openModal('new-document', route.params.project);
        },
      },
      {
        id: 'review',
        label: 'Request review',
        shortcut: 'R',
        icon: 'clock',
        run: () => {
          onClose();
          navigate(`#/projects/${route.params.project}?tab=reviews`);
        },
      },
      {
        id: 'file',
        label: 'Add file',
        shortcut: 'F',
        icon: 'attachment',
        run: () => {
          onClose();
          navigate(`#/projects/${route.params.project}?tab=work`);
        },
      },
    ];
  } else if (isClient) {
    actions = [
      {
        id: 'project',
        label: 'New project',
        shortcut: 'P',
        icon: 'projects',
        run: () => {
          onClose();
          navigate('#/new-project');
        },
      },
      {
        id: 'document',
        label: 'New proposal',
        shortcut: 'D',
        icon: 'documents',
        run: () => {
          onClose();
          overlay.openModal('new-document');
        },
      },
      {
        id: 'task',
        label: 'New task',
        shortcut: 'T',
        icon: 'tasks',
        run: () => {
          onClose();
          overlay.openModal('new-task');
        },
      },
    ];
  } else {
    actions = [
      {
        id: 'client',
        label: 'New client',
        shortcut: 'C',
        icon: 'clients',
        run: () => {
          onClose();
          overlay.openModal('new-client');
        },
      },
      {
        id: 'project',
        label: 'New project',
        shortcut: 'P',
        icon: 'projects',
        run: () => {
          onClose();
          navigate('#/new-project');
        },
      },
      {
        id: 'task',
        label: 'New task',
        shortcut: 'T',
        icon: 'tasks',
        run: () => {
          onClose();
          overlay.openModal('new-task');
        },
      },
      {
        id: 'document',
        label: 'New document',
        shortcut: 'D',
        icon: 'documents',
        run: () => {
          onClose();
          overlay.openModal('new-document');
        },
      },
    ];
  }

  return (
    <div className="cd-menu-group" style={{ minWidth: 200 }}>
      <div className="cd-menu-group-label">Create</div>
      {actions.map((a) => (
        <button type="button" role="menuitem" key={a.id} className="cd-menu-item" onClick={a.run}>
          <Icon name={a.icon} size={15} />
          <span style={{ flex: 1 }}>{a.label}</span>
          <span className="kbd" style={{ fontSize: 10, padding: '0 4px', lineHeight: '16px' }}>{a.shortcut}</span>
        </button>
      ))}
    </div>
  );
}
