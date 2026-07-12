import { useState } from 'react';
import { maintenanceTasks as initialTasks } from '@/app/data/mockData';
import type { MaintenanceStatus, Priority } from '@/app/data/mockData';
import StatusBadge from '@/app/components/StatusBadge';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Plus, Wrench, X, ArrowLeft, ArrowRight } from 'lucide-react';

/* ── Kanban column definitions ───────────────────────────────────────── */

const columns: { status: MaintenanceStatus; label: string; borderColor: string }[] = [
  { status: 'Pending', label: 'Pending', borderColor: 'var(--status-warning)' },
  { status: 'Approved', label: 'Approved', borderColor: 'var(--status-info)' },
  { status: 'Assigned', label: 'Assigned', borderColor: 'var(--primary-navy)' },
  { status: 'In Progress', label: 'In Progress', borderColor: 'var(--status-info)' },
  { status: 'Resolved', label: 'Resolved', borderColor: 'var(--status-success)' },
];

const statuses: MaintenanceStatus[] = ['Pending', 'Approved', 'Assigned', 'In Progress', 'Resolved'];

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
  const [localTasks, setLocalTasks] = useState(initialTasks);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetTag, setAssetTag] = useState('');
  const [assetName, setAssetName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assignee, setAssignee] = useState('Kevin Moore');
  const [reportedBy, setReportedBy] = useState('Alicia Chen');

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!assetTag || !assetName || !title) return;

    const newTask = {
      id: `MNT-0${localTasks.length + 1}`,
      assetTag: assetTag.startsWith('AST-') ? assetTag : `AST-${assetTag}`,
      assetName,
      title,
      priority,
      status: 'Pending' as const,
      assignee: assignee || '—',
      reportedBy,
      createdDate: new Date().toISOString().split('T')[0],
      description,
    };

    setLocalTasks(prev => [newTask, ...prev]);
    setIsModalOpen(false);
    setAssetTag('');
    setAssetName('');
    setTitle('');
    setDescription('');
  }

  function moveTask(taskId: string, direction: 'prev' | 'next') {
    setLocalTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const currentIdx = statuses.indexOf(task.status);
      let newIdx = currentIdx;
      if (direction === 'next' && currentIdx < statuses.length - 1) {
        newIdx = currentIdx + 1;
      } else if (direction === 'prev' && currentIdx > 0) {
        newIdx = currentIdx - 1;
      }
      return { ...task, status: statuses[newIdx] };
    }));
  }

  return (
    <div>
      <PageHeader
        title="Maintenance"
        description="Track and manage asset maintenance workflows"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="size-4" />
            New Request
          </Button>
        }
      />

      {/* ── Kanban Board ─────────────────────────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const tasks = localTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="min-w-[280px] flex-1 rounded-xl border p-4"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border-default)',
                borderTopWidth: '3px',
                borderTopColor: col.borderColor,
              }}
            >
              {/* Column header */}
              <div className="flex justify-between items-center mb-3">
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--primary-navy)' }}
                >
                  {col.label}
                </span>
                <span
                  className="text-xs rounded-full px-2 py-0.5 font-medium"
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
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border p-4 shadow-xs hover:shadow-sm transition-all"
                    style={{
                      backgroundColor: 'var(--elevated)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    {/* Header: Title & Navigation controls */}
                    <div className="flex justify-between items-start gap-2">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {task.title}
                      </p>
                      
                      {/* Move controls */}
                      <div className="flex gap-1 shrink-0">
                        {statuses.indexOf(task.status) > 0 && (
                          <button
                            onClick={() => moveTask(task.id, 'prev')}
                            className="p-1 rounded-md hover:bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                            title="Move back"
                          >
                            <ArrowLeft className="size-3" />
                          </button>
                        )}
                        {statuses.indexOf(task.status) < statuses.length - 1 && (
                          <button
                            onClick={() => moveTask(task.id, 'next')}
                            className="p-1 rounded-md hover:bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                            title="Move forward"
                          >
                            <ArrowRight className="size-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Asset name */}
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {task.assetName} · <span className="font-mono text-[10px]">{task.assetTag}</span>
                    </p>

                    {/* Priority badge */}
                    <div className="mt-2">
                      <StatusBadge status={task.priority} />
                    </div>

                    {/* Assignee & Date */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-default)]">
                      <div className="flex items-center gap-2">
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
                          className="text-xs font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {task.assignee}
                        </span>
                      </div>
                      <p
                        className="text-[10px]"
                        style={{
                          color: 'var(--text-tertiary)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {task.createdDate}
                      </p>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <p
                    className="text-xs text-center py-8"
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

      {/* ── New Request Modal ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div 
            className="w-full max-w-md rounded-xl border p-6 space-y-4 animate-fade-in-up"
            style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--primary-navy)' }}>
                New Maintenance Request
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="mntAssetTag">Asset Tag</Label>
                <Input 
                  id="mntAssetTag" 
                  placeholder="AST-1302" 
                  value={assetTag} 
                  onChange={(e) => setAssetTag(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="mntAssetName">Asset Name</Label>
                <Input 
                  id="mntAssetName" 
                  placeholder="HP LaserJet Printer" 
                  value={assetName} 
                  onChange={(e) => setAssetName(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="mntTitle">Issue Title</Label>
                <Input 
                  id="mntTitle" 
                  placeholder="Printer toner leaking" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="mntDesc">Description</Label>
                <textarea 
                  id="mntDesc" 
                  placeholder="Provide details about the issue..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs h-20 outline-none focus-visible:border-[var(--primary-navy)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mntPriority">Priority</Label>
                  <select 
                    id="mntPriority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="mntAssignee">Assignee</Label>
                  <select 
                    id="mntAssignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="Kevin Moore">Kevin Moore</option>
                    <option value="Lisa Tran">Lisa Tran</option>
                    <option value="—">Unassigned</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
