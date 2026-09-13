/**
 * Figma-style Team Switcher Menu.
 *
 * Provides team switching, collaborative workspace management, member invitations,
 * and team creation directly from the navigation rail.
 */

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { Icon } from '../ui/Icon';

interface TeamItem {
  id: string;
  name: string;
  plan: string;
  membersCount: number;
  initial: string;
  color: string;
}

const TEAMS_LIST: TeamItem[] = [
  {
    id: 'team-northlight',
    name: 'Northlight Studio',
    plan: 'Pro Plan',
    membersCount: 3,
    initial: 'N',
    color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },
  {
    id: 'team-ayari',
    name: 'Ayari Design Lab',
    plan: 'Team Plan',
    membersCount: 5,
    initial: 'A',
    color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  },
  {
    id: 'team-personal',
    name: 'Personal Projects',
    plan: 'Starter Plan',
    membersCount: 1,
    initial: 'P',
    color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  },
];

export function TeamsMenu({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore();
  const overlay = useOverlay();
  const currentTeamName = state.workspace.name;

  const handleSelectTeam = (team: TeamItem) => {
    if (team.name !== currentTeamName) {
      dispatch({
        type: 'workspace/patch',
        patch: { name: team.name },
      });
      overlay.toast('Workspace Switched', `Active workspace is now “${team.name}”`, 'default');
    }
    onClose();
  };

  const handleInvite = () => {
    onClose();
    overlay.openModal('invite-team');
  };

  const handleCreateTeam = () => {
    onClose();
    overlay.openModal('create-team');
  };

  const handleSettings = () => {
    onClose();
    navigate('#/settings/account');
  };

  return (
    <div className="cd-teams-popover" style={{ minWidth: 260, padding: '6px 4px' }}>
      <div className="cd-teams-popover-head" style={{ padding: '6px 10px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--metadata)', textTransform: 'uppercase' }}>
        Teams & Workspaces
      </div>

      <div className="cd-teams-list" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {TEAMS_LIST.map((team) => {
          const isActive = team.name.toLowerCase() === currentTeamName.toLowerCase();
          return (
            <button
              key={team.id}
              type="button"
              className={`cd-team-row ${isActive ? 'is-active' : ''}`}
              onClick={() => handleSelectTeam(team)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 10px',
                borderRadius: 'var(--r-control, 8px)',
                background: isActive ? 'var(--row-selected)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'color-mix(in srgb, var(--accent) 30%, transparent)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                color: 'inherit',
                transition: 'background var(--ease)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: team.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13,
                  flex: '0 0 auto',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                {team.initial}
              </div>
              <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {team.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--metadata)' }}>
                  {team.plan} · {team.membersCount} {team.membersCount === 1 ? 'member' : 'members'}
                </div>
              </div>
              {isActive ? (
                <span style={{ color: 'var(--accent)', flex: '0 0 auto', display: 'inline-flex' }}>
                  <Icon name="check" size={15} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div style={{ height: 1, background: 'var(--divider)', margin: '8px 4px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button
          type="button"
          className="cd-menu-item"
          onClick={handleInvite}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '7px 10px',
            borderRadius: 'var(--r-control, 8px)',
            background: 'transparent',
            border: 0,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <Icon name="users" size={15} />
          <span>Invite members to team...</span>
        </button>

        <button
          type="button"
          className="cd-menu-item"
          onClick={handleCreateTeam}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '7px 10px',
            borderRadius: 'var(--r-control, 8px)',
            background: 'transparent',
            border: 0,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <Icon name="plus" size={15} />
          <span>Create new team...</span>
        </button>

        <button
          type="button"
          className="cd-menu-item"
          onClick={handleSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '7px 10px',
            borderRadius: 'var(--r-control, 8px)',
            background: 'transparent',
            border: 0,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <Icon name="settings" size={15} />
          <span>Team settings</span>
        </button>
      </div>
    </div>
  );
}
