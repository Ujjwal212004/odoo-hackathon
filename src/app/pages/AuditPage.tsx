import { useState } from 'react';
import { auditItems as initialAuditItems } from '@/app/data/mockData';
import type { AuditStatus } from '@/app/data/mockData';
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
import { Checkbox } from '@/app/components/ui/checkbox';
import { FileText, Download } from 'lucide-react';

export default function AuditPage() {
  const [items, setItems] = useState(initialAuditItems);

  const verifiedCount = items.filter((i) => i.status === 'Verified').length;
  const pendingCount = items.filter((i) => i.status === 'Pending').length;
  const missingCount = items.filter((i) => i.status === 'Missing').length;
  const discrepancyCount = items.filter((i) => i.status === 'Discrepancy').length;

  const totalItems = items.length;
  const progressPercent = totalItems > 0 ? Math.round((verifiedCount / totalItems) * 100) : 0;

  const summaryCards = [
    { label: 'Verified', count: verifiedCount, borderColor: 'var(--status-success)' },
    { label: 'Pending', count: pendingCount, borderColor: 'var(--status-warning)' },
    { label: 'Missing', count: missingCount, borderColor: 'var(--status-danger)' },
    { label: 'Discrepancy', count: discrepancyCount, borderColor: 'var(--status-warning)' },
  ];

  function handleVerifyToggle(id: string, isChecked: boolean) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: isChecked ? ('Verified' as AuditStatus) : ('Pending' as AuditStatus),
          verifiedBy: isChecked ? 'Alicia Chen' : '—',
          verifiedDate: isChecked ? new Date().toISOString().split('T')[0] : '—',
        };
      })
    );
  }

  function handleGenerateReport() {
    alert(`Audit Report Generated:\nVerified: ${verifiedCount}\nPending: ${pendingCount}\nMissing: ${missingCount}\nDiscrepancies: ${discrepancyCount}\nSaved to system logs.`);
  }

  return (
    <div>
      <PageHeader
        title="Audit"
        description="Verify asset inventory and resolve discrepancies"
        actions={
          <>
            <Button onClick={handleGenerateReport}>
              <FileText className="size-4" />
              Generate Report
            </Button>
          </>
        }
      />

      {/* ── Summary Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border p-4 transition-all"
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border-default)',
              borderLeftWidth: '4px',
              borderLeftColor: card.borderColor,
            }}
          >
            <p
              className="text-xs uppercase tracking-wide"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {card.label}
            </p>
            <p
              className="text-2xl font-semibold mt-1"
              style={{
                color: 'var(--primary-navy)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {card.count}
            </p>
          </div>
        ))}
      </div>

      {/* ── Progress Bar ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg border p-5 mb-6"
        style={{
          backgroundColor: 'var(--elevated)',
          borderColor: 'var(--border-default)',
        }}
      >
        <p
          className="text-[0.9375rem] font-medium mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Audit Progress
        </p>
        <p
          className="text-sm mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {verifiedCount} of {totalItems} assets verified — {progressPercent}%
        </p>
        <div
          className="h-2 rounded-full w-full"
          style={{ backgroundColor: 'var(--canvas)' }}
        >
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: 'var(--primary-navy)',
            }}
          />
        </div>
      </div>

      {/* ── Audit Table ──────────────────────────────────────────────── */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'var(--elevated)',
          borderColor: 'var(--border-default)',
        }}
      >
        <Table>
          <TableHeader>
            <TableRow
              className="border-b"
              style={{ backgroundColor: 'var(--canvas)', borderColor: 'var(--border-default)' }}
            >
              <TableHead
                className="w-10 text-center"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Verify
              </TableHead>
              <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                Asset Tag
              </TableHead>
              <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                Asset Name
              </TableHead>
              <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                Location
              </TableHead>
              <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                Status
              </TableHead>
              <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                Verified By
              </TableHead>
              <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                Date
              </TableHead>
              <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                Notes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const rowBg =
                item.status === 'Verified'
                  ? 'var(--status-success-bg)'
                  : item.status === 'Missing'
                    ? 'var(--status-danger-bg)'
                    : undefined;

              return (
                <TableRow
                  key={item.id}
                  className="border-b"
                  style={{
                    backgroundColor: rowBg,
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={item.status === 'Verified'} 
                      onCheckedChange={(checked) => handleVerifyToggle(item.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell
                    className="font-mono text-sm font-semibold"
                    style={{ color: 'var(--primary-navy)' }}
                  >
                    {item.assetTag}
                  </TableCell>
                  <TableCell
                    className="text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.assetName}
                  </TableCell>
                  <TableCell
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.location}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.verifiedBy}
                  </TableCell>
                  <TableCell
                    className="text-sm"
                    style={{
                      color: 'var(--text-secondary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {item.verifiedDate}
                  </TableCell>
                  <TableCell
                    className="text-sm max-w-[200px] truncate"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {item.notes || '—'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
