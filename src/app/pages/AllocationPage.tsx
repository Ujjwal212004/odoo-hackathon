import { useState } from 'react';
import { allocations as initialAllocations } from '@/app/data/mockData';
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
import { Plus, UserCheck, X } from 'lucide-react';

export default function AllocationPage() {
  const [localAllocations, setLocalAllocations] = useState(initialAllocations);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetTag, setAssetTag] = useState('');
  const [assetName, setAssetName] = useState('');
  const [allocatedTo, setAllocatedTo] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [approvedBy, setApprovedBy] = useState('Tom Richards');

  const activeCount = localAllocations.filter((a) => a.status === 'Active').length;
  const pendingCount = localAllocations.filter((a) => a.status === 'Pending').length;
  const returnedCount = localAllocations.filter((a) => a.status === 'Returned').length;

  function handleCreateAllocation(e: React.FormEvent) {
    e.preventDefault();
    if (!assetTag || !assetName || !allocatedTo) return;

    const newAlloc = {
      id: `ALC-0${localAllocations.length + 1}`,
      assetTag: assetTag.startsWith('AST-') ? assetTag : `AST-${assetTag}`,
      assetName,
      allocatedTo,
      department,
      date: new Date().toISOString().split('T')[0],
      status: 'Active' as const,
      approvedBy,
    };

    setLocalAllocations(prev => [newAlloc, ...prev]);
    setIsModalOpen(false);
    setAssetTag('');
    setAssetName('');
    setAllocatedTo('');
  }

  return (
    <div>
      <PageHeader
        title="Allocation"
        description="Manage asset assignments across your organization"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="size-4" />
            New Allocation
          </Button>
        }
      />

      {/* ── Summary Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Active Allocations */}
        <div
          className="rounded-lg border p-5"
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
          className="rounded-lg border p-5"
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
          className="rounded-lg border p-5"
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
        className="rounded-lg border overflow-hidden"
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
            {localAllocations.map((alloc) => (
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

      {/* ── New Allocation Modal ──────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div 
            className="w-full max-w-md rounded-lg border p-6 space-y-4 animate-fade-in-up"
            style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--primary-navy)' }}>
                New Allocation Request
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAllocation} className="space-y-4">
              <div>
                <Label htmlFor="allocAssetTag">Asset Tag</Label>
                <Input 
                  id="allocAssetTag" 
                  placeholder="AST-1168" 
                  value={assetTag} 
                  onChange={(e) => setAssetTag(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="allocAssetName">Asset Name</Label>
                <Input 
                  id="allocAssetName" 
                  placeholder='Dell UltraSharp 27"' 
                  value={assetName} 
                  onChange={(e) => setAssetName(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="allocatedTo">Allocate To (Employee Name)</Label>
                <Input 
                  id="allocatedTo" 
                  placeholder="James Park" 
                  value={allocatedTo} 
                  onChange={(e) => setAllocatedTo(e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="allocDept">Department</Label>
                  <select 
                    id="allocDept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="IT">IT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="approvedBy">Approved By</Label>
                  <Input 
                    id="approvedBy" 
                    value={approvedBy} 
                    onChange={(e) => setApprovedBy(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Allocate Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

