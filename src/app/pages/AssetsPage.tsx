import { useState } from 'react';
import { assets } from '@/app/data/mockData';
import StatusBadge from '@/app/components/StatusBadge';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Search,
  Filter,
  Download,
  Plus,
  QrCode,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const STATUS_FILTERS = ['All', 'Available', 'Allocated', 'Under Maintenance', 'Retired'] as const;

export default function AssetsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      search === '' ||
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.tag.toLowerCase().includes(search.toLowerCase()) ||
      asset.owner.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || asset.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Assets"
        description="Complete inventory of organizational assets"
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Filter className="size-4" />
              Filter
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="size-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              Add Asset
            </Button>
          </>
        }
      />

      {/* ── Search & Filter Bar ──────────────────────────────── */}
      <div
        className="mb-6 flex items-center gap-4 rounded-xl border p-4"
        style={{
          borderColor: 'var(--border-default)',
          backgroundColor: 'var(--elevated)',
        }}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, tag, or owner..."
            className="pl-9"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--canvas)',
            }}
          />
        </div>

        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
              style={
                statusFilter === status
                  ? {
                      backgroundColor: 'var(--primary-navy)',
                      color: '#FFFFFF',
                    }
                  : {
                      backgroundColor: 'var(--canvas)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-default)',
                    }
              }
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          borderColor: 'var(--border-default)',
          backgroundColor: 'var(--elevated)',
        }}
      >
        <Table>
          <TableHeader>
            <TableRow
              style={{ backgroundColor: 'var(--canvas)' }}
            >
              <TableHead
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Asset Tag
              </TableHead>
              <TableHead
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Name
              </TableHead>
              <TableHead
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Category
              </TableHead>
              <TableHead
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Status
              </TableHead>
              <TableHead
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Owner
              </TableHead>
              <TableHead
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Department
              </TableHead>
              <TableHead
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Location
              </TableHead>
              <TableHead
                className="w-10 text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow
                key={asset.id}
                className="cursor-pointer transition-colors"
                style={{ borderColor: 'var(--border-default)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--surface)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <TableCell>
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: 'var(--primary-navy)' }}
                  >
                    {asset.tag}
                  </span>
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {asset.name}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {asset.category}
                </TableCell>
                <TableCell>
                  <StatusBadge status={asset.status} />
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {asset.owner}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {asset.department}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {asset.location}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <QrCode
                      className="size-4"
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Showing{' '}
          <span
            style={{
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-primary)',
              fontWeight: 500,
            }}
          >
            {filteredAssets.length}
          </span>{' '}
          of{' '}
          <span
            style={{
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-primary)',
              fontWeight: 500,
            }}
          >
            {assets.length}
          </span>{' '}
          assets
        </span>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            style={{
              backgroundColor: 'var(--primary-navy)',
              color: '#FFFFFF',
              borderColor: 'var(--primary-navy)',
            }}
          >
            1
          </Button>
          <Button variant="outline" size="icon">
            2
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
