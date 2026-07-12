import type { AssetStatus, MaintenanceStatus, TransferStatus, AuditStatus, Priority } from '../data/mockData';

type StatusType = AssetStatus | MaintenanceStatus | TransferStatus | AuditStatus | Priority | 'Active' | 'Returned' | 'Pending' | 'Confirmed' | 'Cancelled' | 'Connected' | 'Disconnected';

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  // Asset statuses
  'Available':         { bg: 'var(--status-success-bg)', text: 'var(--status-success)', border: 'var(--status-success-border)' },
  'Allocated':         { bg: 'rgba(20, 33, 61, 0.06)', text: 'var(--primary-navy)', border: 'rgba(20, 33, 61, 0.15)' },
  'Under Maintenance': { bg: 'var(--status-warning-bg)', text: 'var(--status-warning)', border: 'var(--status-warning-border)' },
  'Booked':            { bg: 'var(--status-info-bg)', text: 'var(--status-info)', border: 'var(--status-info-border)' },
  'Retired':           { bg: 'var(--surface)', text: 'var(--text-tertiary)', border: 'var(--border-default)' },
  'In Transit':        { bg: 'var(--status-info-bg)', text: 'var(--status-info)', border: 'var(--status-info-border)' },

  // Maintenance statuses
  'Pending':           { bg: 'var(--status-warning-bg)', text: 'var(--status-warning)', border: 'var(--status-warning-border)' },
  'Approved':          { bg: 'var(--status-info-bg)', text: 'var(--status-info)', border: 'var(--status-info-border)' },
  'Assigned':          { bg: 'rgba(20, 33, 61, 0.06)', text: 'var(--primary-navy)', border: 'rgba(20, 33, 61, 0.15)' },
  'In Progress':       { bg: 'var(--status-info-bg)', text: 'var(--status-info)', border: 'var(--status-info-border)' },
  'Resolved':          { bg: 'var(--status-success-bg)', text: 'var(--status-success)', border: 'var(--status-success-border)' },

  // Transfer statuses
  'Pending Approval':  { bg: 'var(--status-warning-bg)', text: 'var(--status-warning)', border: 'var(--status-warning-border)' },
  'Completed':         { bg: 'var(--status-success-bg)', text: 'var(--status-success)', border: 'var(--status-success-border)' },
  'Rejected':          { bg: 'var(--status-danger-bg)', text: 'var(--status-danger)', border: 'var(--status-danger-border)' },

  // Audit statuses
  'Verified':          { bg: 'var(--status-success-bg)', text: 'var(--status-success)', border: 'var(--status-success-border)' },
  'Missing':           { bg: 'var(--status-danger-bg)', text: 'var(--status-danger)', border: 'var(--status-danger-border)' },
  'Discrepancy':       { bg: 'var(--status-warning-bg)', text: 'var(--status-warning)', border: 'var(--status-warning-border)' },

  // Priority levels
  'Critical':          { bg: 'var(--status-danger-bg)', text: 'var(--status-danger)', border: 'var(--status-danger-border)' },
  'High':              { bg: 'var(--status-warning-bg)', text: 'var(--status-warning)', border: 'var(--status-warning-border)' },
  'Medium':            { bg: 'var(--status-info-bg)', text: 'var(--status-info)', border: 'var(--status-info-border)' },
  'Low':               { bg: 'var(--surface)', text: 'var(--text-secondary)', border: 'var(--border-default)' },

  // Booking / Allocation
  'Active':            { bg: 'var(--status-success-bg)', text: 'var(--status-success)', border: 'var(--status-success-border)' },
  'Returned':          { bg: 'var(--surface)', text: 'var(--text-secondary)', border: 'var(--border-default)' },
  'Confirmed':         { bg: 'var(--status-success-bg)', text: 'var(--status-success)', border: 'var(--status-success-border)' },
  'Cancelled':         { bg: 'var(--surface)', text: 'var(--text-tertiary)', border: 'var(--border-default)' },

  // Integrations
  'Connected':         { bg: 'var(--status-success-bg)', text: 'var(--status-success)', border: 'var(--status-success-border)' },
  'Disconnected':      { bg: 'var(--surface)', text: 'var(--text-tertiary)', border: 'var(--border-default)' },
};

const fallback = { bg: 'var(--surface)', text: 'var(--text-secondary)', border: 'var(--border-default)' };

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = statusStyles[status] || fallback;

  return (
    <span
      className={`inline-flex items-center rounded-[6px] border px-2 py-0.5 text-[0.6875rem] font-medium leading-5 ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {status}
    </span>
  );
}
