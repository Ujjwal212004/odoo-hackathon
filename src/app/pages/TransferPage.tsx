import { useState } from 'react';
import { transfers as initialTransfers } from '@/app/data/mockData';
import type { TransferStatus } from '@/app/data/mockData';
import StatusBadge from '@/app/components/StatusBadge';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { ArrowLeftRight, Plus, X } from 'lucide-react';

const pipelineStatuses: { label: string; status: TransferStatus; borderColor: string }[] = [
  { label: 'Pending Approval', status: 'Pending Approval', borderColor: 'var(--status-warning)' },
  { label: 'Approved', status: 'Approved', borderColor: 'var(--status-info)' },
  { label: 'In Transit', status: 'In Transit', borderColor: 'var(--status-info)' },
  { label: 'Completed', status: 'Completed', borderColor: 'var(--status-success)' },
];

export default function TransferPage() {
  const [localTransfers, setLocalTransfers] = useState(initialTransfers);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetTag, setAssetTag] = useState('');
  const [assetName, setAssetName] = useState('');
  const [fromDept, setFromDept] = useState('IT');
  const [toDept, setToDept] = useState('Sales');
  const [requestedBy, setRequestedBy] = useState('');
  const [reason, setReason] = useState('');

  function handleCreateTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!assetTag || !assetName || !requestedBy) return;

    const newTransfer = {
      id: `TRF-0${localTransfers.length + 1}`,
      assetTag: assetTag.startsWith('AST-') ? assetTag : `AST-${assetTag}`,
      assetName,
      fromDepartment: fromDept,
      toDepartment: toDept,
      requestedBy,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Approval' as const,
      reason,
    };

    setLocalTransfers(prev => [newTransfer, ...prev]);
    setIsModalOpen(false);
    setAssetTag('');
    setAssetName('');
    setRequestedBy('');
    setReason('');
  }

  return (
    <div>
      <PageHeader
        title="Transfer"
        description="Track asset movements between departments"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <ArrowLeftRight className="size-4" />
            Request Transfer
          </Button>
        }
      />

      {/* ── Pipeline Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {pipelineStatuses.map(({ label, status, borderColor }) => {
          const count = localTransfers.filter((t) => t.status === status).length;
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
            {localTransfers.map((transfer) => (
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

      {/* ── Request Transfer Modal ────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div 
            className="w-full max-w-md rounded-xl border p-6 space-y-4 animate-fade-in-up"
            style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--primary-navy)' }}>
                New Transfer Request
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div>
                <Label htmlFor="trfAssetTag">Asset Tag</Label>
                <Input 
                  id="trfAssetTag" 
                  placeholder="AST-1350" 
                  value={assetTag} 
                  onChange={(e) => setAssetTag(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="trfAssetName">Asset Name</Label>
                <Input 
                  id="trfAssetName" 
                  placeholder='iPad Pro 12.9"' 
                  value={assetName} 
                  onChange={(e) => setAssetName(e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trfFromDept">From Department</Label>
                  <select 
                    id="trfFromDept"
                    value={fromDept}
                    onChange={(e) => setFromDept(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="IT">IT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="trfToDept">To Department</Label>
                  <select 
                    id="trfToDept"
                    value={toDept}
                    onChange={(e) => setToDept(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="IT">IT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="trfRequestedBy">Requested By</Label>
                <Input 
                  id="trfRequestedBy" 
                  placeholder="James Park" 
                  value={requestedBy} 
                  onChange={(e) => setRequestedBy(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="trfReason">Reason for Transfer</Label>
                <Input 
                  id="trfReason" 
                  placeholder="Temporary field demo use" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Request Transfer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

