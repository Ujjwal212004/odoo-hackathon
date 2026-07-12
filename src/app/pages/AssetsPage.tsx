import { useState } from 'react';
import { useNavigate } from 'react-router';
import { assets as initialAssets } from '@/app/data/mockData';
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
import {
  Search,
  Filter,
  Download,
  Plus,
  QrCode,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const STATUS_FILTERS = ['All', 'Available', 'Allocated', 'Under Maintenance', 'Retired'] as const;

export default function AssetsPage() {
  const navigate = useNavigate();
  const [localAssets, setLocalAssets] = useState(initialAssets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Laptop');
  const [newStatus, setNewStatus] = useState<'Available' | 'Allocated' | 'Under Maintenance'>('Available');
  const [newOwner, setNewOwner] = useState('');
  const [newDepartment, setNewDepartment] = useState('IT');
  const [newLocation, setNewLocation] = useState('HQ East');

  // Filter logic
  const filteredAssets = localAssets.filter((asset) => {
    const matchesSearch =
      search === '' ||
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.tag.toLowerCase().includes(search.toLowerCase()) ||
      asset.owner.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || asset.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'All' || asset.category === categoryFilter;

    const matchesDept =
      departmentFilter === 'All' || asset.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesDept;
  });

  const categories = ['All', ...Array.from(new Set(localAssets.map(a => a.category)))];
  const departments = ['All', ...Array.from(new Set(localAssets.map(a => a.department)))];

  function handleAddAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!newTag || !newName) return;

    const newAsset = {
      id: String(localAssets.length + 1),
      tag: newTag.startsWith('AST-') ? newTag : `AST-${newTag}`,
      name: newName,
      category: newCategory,
      status: newStatus,
      owner: newOwner || '—',
      department: newDepartment,
      location: newLocation,
      purchaseDate: new Date().toISOString().split('T')[0],
      value: 1200,
      healthScore: 100,
      lastUpdated: new Date().toISOString().split('T')[0],
      serialNumber: Math.random().toString(36).substring(2, 14).toUpperCase(),
    };

    setLocalAssets(prev => [newAsset, ...prev]);
    setIsAddModalOpen(false);
    setNewTag('');
    setNewName('');
    setNewOwner('');
  }

  function handleExport() {
    alert('Exporting inventory data as CSV... Saved to downloads.');
  }

  return (
    <div>
      <PageHeader
        title="Assets"
        description="Complete inventory of organizational assets"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowAdvancedFilters(prev => !prev)}>
              <Filter className="size-4" />
              Filter
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="size-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="size-4" />
              Add Asset
            </Button>
          </>
        }
      />

      {/* ── Advanced Filters Panel ───────────────────────────── */}
      {showAdvancedFilters && (
        <div 
          className="mb-4 rounded-lg border p-4 grid grid-cols-3 gap-4 animate-fade-in"
          style={{
            borderColor: 'var(--border-default)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <div>
            <Label>Category</Label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="mt-1 w-full rounded-[8px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)]"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <Label>Department</Label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="mt-1 w-full rounded-[8px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)]"
            >
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <div className="flex items-end justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setCategoryFilter('All');
                setDepartmentFilter('All');
                setShowAdvancedFilters(false);
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      )}

      {/* ── Search & Filter Bar ──────────────────────────────── */}
      <div
        className="mb-6 flex items-center gap-4 rounded-lg border p-4"
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
              className="rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
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
        className="overflow-hidden rounded-lg border"
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
                onClick={() => navigate(`/assets/${asset.id}`)}
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
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => alert(`QR Code generated for asset ${asset.tag}`)}>
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
            {localAssets.length}
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
          <Button variant="outline" size="icon" onClick={() => alert('Viewing page 2...')}>
            2
          </Button>
          <Button variant="outline" size="icon" onClick={() => alert('Viewing next page...')}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* ── Add Asset Modal ───────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div 
            className="w-full max-w-md rounded-lg border p-6 space-y-4 animate-fade-in-up"
            style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--primary-navy)' }}>
                Add New Asset
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <Label htmlFor="assetTag">Asset Tag</Label>
                <Input 
                  id="assetTag" 
                  placeholder="AST-1500" 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="assetName">Asset Name</Label>
                <Input 
                  id="assetName" 
                  placeholder="MacBook Pro M3 Max" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assetCategory">Category</Label>
                  <select 
                    id="assetCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Display">Display</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="assetStatus">Status</Label>
                  <select 
                    id="assetStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="mt-1 w-full rounded-[8px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="Available">Available</option>
                    <option value="Allocated">Allocated</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assetOwner">Owner (Optional)</Label>
                  <Input 
                    id="assetOwner" 
                    placeholder="Mina Chen" 
                    value={newOwner} 
                    onChange={(e) => setNewOwner(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="assetDept">Department</Label>
                  <select 
                    id="assetDept"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="IT">IT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="assetLoc">Location</Label>
                <Input 
                  id="assetLoc" 
                  placeholder="HQ East — Floor 4" 
                  value={newLocation} 
                  onChange={(e) => setNewLocation(e.target.value)}
                  required 
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
