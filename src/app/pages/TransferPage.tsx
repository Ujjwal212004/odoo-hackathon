import { transfers } from '@/app/data/mockData';
import type { TransferStatus } from '@/app/data/mockData';
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
import { ArrowLeftRight, Plus } from 'lucide-react';

const pipelineStatuses: { label: string; status: TransferStatus; borderColor: string }[] = [
  { label: 'Pending Approval', status: 'Pending Approval', borderColor: 'var(--status-warning)' },
  { label: 'Approved', status: 'Approved', borderColor: 'var(--status-info)' },
  { label: 'In Transit', status: 'In Transit', borderColor: 'var(--status-info)' },
  { label: 'Completed', status: 'Completed', borderColor: 'var(--status-success)' },
];

export default function TransferPage() {
  return (
    <div>
      <PageHeader
        title="Transfer"
        description="Track asset movements between departments"
        actions={
          <Button>
            <ArrowLeftRight className="size-4" />
            Request Transfer
          </Button>
        }
      />

      {/* ── Pipeline Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {pipelineStatuses.map(({ label, status, borderColor }) => {
          const count = transfers.filter((t) => t.status === status).length;
          return (
            <div
              key={status}
              className="rounded-xl border p-4"
              style={{
                backgroundColor: 'var(--elevated)',
                borderColor: 'var(--border-default)',
                borderLeftWidth: '4px',
                borderLeftColor: borderColor,
              }}
            >
              <span
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                {label}
              </span>
              <p
                className="text-2xl font-semibold mt-1"
                style={{
                  color: 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {count}
              </p>
            </div>
          );
        })}
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
                Asset
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                From
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                To
              </TableHead>
              <TableHead
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Requested By
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
                Reason
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => (
              <TableRow
                key={transfer.id}
                style={{ borderColor: 'var(--border-default)' }}
              >
                <TableCell
                  className="font-mono text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {transfer.id}
                </TableCell>
                <TableCell>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {transfer.assetName}
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {transfer.assetTag}
                    </p>
                  </div>
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {transfer.fromDepartment}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {transfer.toDepartment}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {transfer.requestedBy}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{
                    color: 'var(--text-secondary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {transfer.date}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transfer.status} />
                </TableCell>
                <TableCell
                  className="text-sm max-w-[200px] truncate"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {transfer.reason}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
