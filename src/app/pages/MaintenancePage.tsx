import { maintenanceTasks } from '@/app/data/mockData';
import type { MaintenanceStatus } from '@/app/data/mockData';
import StatusBadge from '@/app/components/StatusBadge';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Plus, Wrench } from 'lucide-react';

/* ── Kanban column definitions ───────────────────────────────────────── */

const columns: { status: MaintenanceStatus; label: string; borderColor: string }[] = [
  { status: 'Pending', label: 'Pending', borderColor: 'var(--status-warning)' },
  { status: 'Approved', label: 'Approved', borderColor: 'var(--status-info)' },
  { status: 'Assigned', label: 'Assigned', borderColor: 'var(--primary-navy)' },
  { status: 'In Progress', label: 'In Progress', borderColor: 'var(--status-info)' },
  { status: 'Resolved', label: 'Resolved', borderColor: 'var(--status-success)' },
];

/** Extract initials from a name string */
function initials(name: string): string {
  if (name === '—') return '—';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function MaintenancePage() {
  return (
    <div>
      <PageHeader
        title="Maintenance"
        description="Track and manage asset maintenance workflows"
        actions={
          <Button>
            <Plus className="size-4" />
            New Request
          </Button>
        }
      />

      {/* ── Kanban Board ─────────────────────────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const tasks = maintenanceTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="min-w-[260px] flex-1 rounded-xl border p-4"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border-default)',
                borderTopWidth: '2px',
                borderTopColor: col.borderColor,
              }}
            >
              {/* Column header */}
              <div className="flex justify-between items-center mb-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {col.label}
                </span>
                <span
                  className="text-xs rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: 'var(--elevated)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-default)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {tasks.length}
                </span>
              </div>

              {/* Task cards */}
              <div className="flex flex-col">
                {tasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className={`rounded-xl border p-4 ${idx < tasks.length - 1 ? 'mb-3' : ''}`}
                    style={{
                      backgroundColor: 'var(--elevated)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    {/* Title */}
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {task.title}
                    </p>

                    {/* Asset name */}
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {task.assetName}
                    </p>

                    {/* Priority badge */}
                    <div className="mt-2">
                      <StatusBadge status={task.priority} />
                    </div>

                    {/* Assignee */}
                    <div className="flex items-center gap-2 mt-3">
                      <div
                        className="size-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--surface)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.625rem',
                          fontWeight: 500,
                        }}
                      >
                        {initials(task.assignee)}
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {task.assignee}
                      </span>
                    </div>

                    {/* Date */}
                    <p
                      className="text-xs mt-2"
                      style={{
                        color: 'var(--text-tertiary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {task.createdDate}
                    </p>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <p
                    className="text-xs text-center py-6"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    No tasks
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
