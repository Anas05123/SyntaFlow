/**
 * Task row — the shared task representation used by the Tasks page, the project
 * Work tab and anywhere else a task is listed. One task record, one row.
 */

import { daysUntil, dueLabel } from '../domain/dates';
import { Button, IconButton, Tick, Tone } from '../ui/primitives';
import type { TaskWithContext } from '../domain/types';

interface TaskRowProps {
  task: TaskWithContext;
  onOpen: () => void;
  onToggle: () => void;
  onPostpone: () => void;
  /** Hide the project/client context when the row is already inside that project. */
  showContext?: boolean;
  showMilestone?: string | null;
}

export function TaskRow({
  task, onOpen, onToggle, onPostpone, showContext = true, showMilestone = null,
}: TaskRowProps) {
  const d = daysUntil(task.due) ?? 0;
  const overdue = d < 0 && task.status !== 'done' && task.status !== 'cancelled';
  const done = task.status === 'done';

  return (
    <div className={`item-row${done ? ' completed' : ''}`}>
      <Tick
        checked={done}
        onToggle={onToggle}
        label={`${done ? 'Reopen' : 'Complete'} ${task.title}`}
      />
      <button type="button" className="item-main" onClick={onOpen} style={{ textAlign: 'left' }}>
        <div className="item-title">{task.title}</div>
        <div className="item-sub">
          {showMilestone ? `${showMilestone} · ` : ''}
          {showContext ? task.contextLabel : task.clientName}
          {task.priority === 'high' ? <> · <span className="mark-risk">High priority</span></> : null}
        </div>
      </button>
      <div className="item-side">
        <Tone tone={overdue ? 'risk' : d <= 1 ? 'waiting' : 'accent'}>
          <span className={!overdue && d > 1 ? 'meta' : undefined}>{dueLabel(task.due)}</span>
        </Tone>
        {task.attention === 'waiting' ? <span className="chip tone-waiting">Waiting</span> : null}
        {task.status === 'in-progress' ? <span className="chip tone-in-progress"><span className="dot" />In progress</span> : null}
      </div>
      <div className="item-actions">
        <IconButton icon="calendar" label="Postpone one day" onClick={onPostpone} />
        <Button size="sm" variant="ghost" onClick={onOpen}>Open</Button>
      </div>
    </div>
  );
}
