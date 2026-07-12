import { notifications as initialNotifications } from '@/app/data/mockData';
import type { NotificationType } from '@/app/data/mockData';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  Settings,
  Info,
} from 'lucide-react';
import { useState } from 'react';

const filterOptions = [
  { key: 'all', label: 'All' },
  { key: 'approval', label: 'Approvals' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'transfer', label: 'Transfers' },
  { key: 'system', label: 'System' },
] as const;

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  approval: {
    icon: Info,
    bg: 'var(--status-info-bg)',
    color: 'var(--status-info)',
  },
  maintenance: {
    icon: AlertTriangle,
    bg: 'var(--status-warning-bg)',
    color: 'var(--status-warning)',
  },
  transfer: {
    icon: ArrowLeftRight,
    bg: 'var(--status-info-bg)',
    color: 'var(--status-info)',
  },
  system: {
    icon: Settings,
    bg: 'var(--surface)',
    color: 'var(--text-secondary)',
  },
  audit: {
    icon: CheckCircle2,
    bg: 'var(--status-success-bg)',
    color: 'var(--status-success)',
  },
};

export default function NotificationsPage() {
  const [localNotifications, setLocalNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<string>('all');

  const filteredNotifications =
    filter === 'all'
      ? localNotifications
      : localNotifications.filter((n) => n.type === filter);

  function handleMarkAllRead() {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function handleToggleRead(id: string) {
    setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay informed about your organization's operations"
        actions={
          <Button variant="secondary" onClick={handleMarkAllRead}>
            <CheckCircle2 className="size-4" />
            Mark all as read
          </Button>
        }
      />

      {/* ── Filter Pills ─────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6">
        {filterOptions.map((opt) => {
          const isActive = filter === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className="rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer border transition-colors"
              style={{
                backgroundColor: isActive
                  ? 'var(--primary-navy)'
                  : 'var(--elevated)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                borderColor: isActive
                  ? 'var(--primary-navy)'
                  : 'var(--border-default)',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* ── Notification List ────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          const IconComponent = config.icon;

          return (
            <div
              key={notification.id}
              onClick={() => handleToggleRead(notification.id)}
              className="rounded-xl border p-5 flex gap-4 cursor-pointer hover:shadow-xs transition-all"
              style={{
                backgroundColor: notification.read
                  ? 'var(--canvas)'
                  : 'var(--elevated)',
                borderColor: 'var(--border-default)',
              }}
            >
              {/* Icon */}
              <div
                className="size-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: config.bg }}
              >
                <IconComponent
                  className="size-4"
                  style={{ color: config.color }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {notification.title}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {notification.message}
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {notification.time}
                </p>
              </div>

              {/* Unread indicator */}
              {!notification.read && (
                <div className="shrink-0 mt-1">
                  <span
                    className="block size-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--primary-navy)' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
