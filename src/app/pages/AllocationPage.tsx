import { allocations } from '@/app/data/mockData';
import StatusBadge from '@/app/components/StatusBadge';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Plus, UserCheck } from 'lucide-react';

export default function AllocationPage() {
  const activeCount = allocations.filter((a) => a.status === 'Active').length;
  const pendingCount = allocations.filter((a) => a.status === 'Pending').length;
  const returnedCount = allocations.filter((a) => a.status === 'Returned').length;

  return (
    <div>
      <PageHeader
        title="Allocation"
        description="Manage asset assignments across your organization"
        actions={
          <Button>
            <Plus className="size-4" />
            New Allocation
          </Button>
        }
      />

      {/* ── Summary Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Active Allocations */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <UserCheck
              className="size-4"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: 'var(--text-secondary)' }}
            >
              Active Allocations
            </span>
          </div>
          <p
            className="text-2xl font-semibold"
            style={{
              color: 'var(--primary-navy)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {activeCount}
          </p>
        </div>

        {/* Pending Approval */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
            borderLeftWidth: '4px',
            borderLeftColor: 'var(--status-warning)',
          }}
        >
          <span
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: 'var(--text-secondary)' }}
          >
            Pending Approval
          </span>
          <p
            className="text-2xl font-semibold mt-2"
            style={{
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pendingCount}
          </p>
        </div>

        {/* Returned This Month */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <span
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: 'var(--text-secondary)' }}
          >
            Returned This Month
          </span>
          <p
            className="text-2xl font-semibold mt-2"
            style={{
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {returnedCount}
          </p>
        </div>
      </div>

      {/* ── Table Card ───────────────────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--elevated)',
          borderColor: 'var(--border-default)',
        }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: 'var(--canvas)' }}>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                ID
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Asset Tag
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Asset Name
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Allocated To
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Department
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Date
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Status
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Approved By
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map((alloc) => (
              <TableRow
                key={alloc.id}
                style={{ borderColor: 'var(--border-default)' }}
              >
                <TableCell
                  className="font-mono text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {alloc.id}
                </TableCell>
                <TableCell
                  className="font-mono text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {alloc.assetTag}
                </TableCell>
                <TableCell
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {alloc.assetName}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {alloc.allocatedTo}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {alloc.department}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{
                    color: 'var(--text-secondary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {alloc.date}
                </TableCell>
                <TableCell>
                  <StatusBadge status={alloc.status} />
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {alloc.approvedBy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
