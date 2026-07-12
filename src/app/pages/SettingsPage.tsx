import { useState } from 'react';
import { roles as initialRoles, integrations as initialIntegrations, Role, Integration } from '@/app/data/mockData';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import {
  Building2,
  Shield,
  Users,
  Palette,
  FileText,
  Plug,
  Plus,
  Edit,
  CheckCircle2,
  X,
} from 'lucide-react';

const auditLogData = [
  {
    id: '1',
    timestamp: '2025-07-11 14:32',
    user: 'Tom Richards',
    action: 'Asset allocated',
    details: 'MacBook Pro 16" assigned to Mina Chen',
  },
  {
    id: '2',
    timestamp: '2025-07-11 11:15',
    user: 'Linda Patel',
    action: 'Audit completed',
    details: 'North Wing — 6 assets verified',
  },
  {
    id: '3',
    timestamp: '2025-07-10 16:48',
    user: 'Kevin Moore',
    action: 'Maintenance resolved',
    details: 'Jabra PanaCast 50 firmware update completed',
  },
  {
    id: '4',
    timestamp: '2025-07-10 09:22',
    user: 'Alex Turner',
    action: 'Transfer requested',
    details: 'Dell Latitude 7440 — IT to Sales',
  },
  {
    id: '5',
    timestamp: '2025-07-09 13:05',
    user: 'Emily Stone',
    action: 'Booking created',
    details: 'Projector Kit — July 14, 14:00–16:00',
  },
];

const brandColors = [
  { name: 'Canvas (Snow White)', hex: '#FCFBF8', color: '#FCFBF8' },
  { name: 'Surface (Porcelain)', hex: '#F6F4EF', color: '#F6F4EF' },
  { name: 'Elevated (White)', hex: '#FFFFFF', color: '#FFFFFF' },
  { name: 'Primary (Oxford Navy)', hex: '#172A45', color: '#172A45' },
  { name: 'Accent (Heritage Brass)', hex: '#B08D57', color: '#B08D57' },
  { name: 'Success (Forest)', hex: '#295943', color: '#295943' },
  { name: 'Warning (Amber)', hex: '#A66B00', color: '#A66B00' },
  { name: 'Danger (Oxblood)', hex: '#7D1F2B', color: '#7D1F2B' },
  { name: 'Info (Slate Blue)', hex: '#355C7D', color: '#355C7D' },
  { name: 'Primary Text', hex: '#1A1A1A', color: '#1A1A1A' },
  { name: 'Secondary Text', hex: '#5E6673', color: '#5E6673' },
  { name: 'Border', hex: '#DDD8CF', color: '#DDD8CF' },
  { name: 'Sidebar', hex: '#F3F1EB', color: '#F3F1EB' },
];

const passwordRequirements = [
  'Minimum 12 characters',
  'One uppercase letter',
  'One number',
  'One special character',
];

export default function SettingsPage() {
  // Org state
  const [orgName, setOrgName] = useState('Meridian Industries');
  const [industry, setIndustry] = useState('Technology & Manufacturing');
  const [contactEmail, setContactEmail] = useState('operations@meridian.com');
  const [address, setAddress] = useState('1200 Innovation Drive, Suite 400\nSan Francisco, CA 94105');
  const [orgSaved, setOrgSaved] = useState(false);

  // Roles state
  const [localRoles, setLocalRoles] = useState(initialRoles);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePerms, setNewRolePerms] = useState('');

  // Security state
  const [twoFactor, setTwoFactor] = useState(true);
  const [timeout, setTimeoutVal] = useState('30');

  // Integrations state
  const [localIntegrations, setLocalIntegrations] = useState(initialIntegrations);

  function handleSaveOrg(e: React.FormEvent) {
    e.preventDefault();
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 3000);
  }

  function handleAddRole(e: React.FormEvent) {
    e.preventDefault();
    if (!newRoleName) return;
    const newRole: Role = {
      id: String(localRoles.length + 1),
      name: newRoleName,
      users: 0,
      permissions: newRolePerms || 'Read-only access to directory',
    };
    setLocalRoles(prev => [...prev, newRole]);
    setIsRoleModalOpen(false);
    setNewRoleName('');
    setNewRolePerms('');
  }

  function toggleIntegration(id: string) {
    setLocalIntegrations(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nextStatus = item.status === 'Connected' ? 'Disconnected' : 'Connected';
      return { ...item, status: nextStatus, lastSync: new Date().toLocaleTimeString() };
    }));
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your organization and platform configuration"
      />

      <Tabs defaultValue="organization">
        <TabsList
          className="mb-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border-default)',
          }}
        >
          <TabsTrigger value="organization" className="text-sm gap-1.5">
            <Building2 className="size-3.5" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="roles" className="text-sm gap-1.5">
            <Users className="size-3.5" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="security" className="text-sm gap-1.5">
            <Shield className="size-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="brand" className="text-sm gap-1.5">
            <Palette className="size-3.5" />
            Brand
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="text-sm gap-1.5">
            <FileText className="size-3.5" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-sm gap-1.5">
            <Plug className="size-3.5" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* ── Organization ─────────────────────────────────────────── */}
        <TabsContent value="organization">
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border-default)',
            }}
          >
            <form onSubmit={handleSaveOrg} className="space-y-5 max-w-lg">
              {orgSaved && (
                <div className="flex items-center gap-2 rounded-[10px] border p-3 text-xs text-[var(--status-success)] bg-[var(--status-success-bg)] border-[var(--status-success-border)]">
                  <CheckCircle2 className="size-4" />
                  Organization details updated successfully.
                </div>
              )}
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-primary)' }}>
                  Organization Name
                </Label>
                <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-primary)' }}>Industry</Label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-primary)' }}>
                  Primary Contact
                </Label>
                <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-primary)' }}>Address</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm transition-colors outline-none"
                  style={{
                    backgroundColor: 'var(--elevated)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="mt-2">Save Changes</Button>
            </form>
          </div>
        </TabsContent>

        {/* ── Roles & Permissions ───────────────────────────────────── */}
        <TabsContent value="roles">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setIsRoleModalOpen(true)}>
              <Plus className="size-4" />
              Add Role
            </Button>
          </div>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border-default)',
            }}
          >
            <Table>
              <TableHeader>
                <TableRow
                  style={{
                    backgroundColor: 'var(--canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    Role Name
                  </TableHead>
                  <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    Users
                  </TableHead>
                  <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    Permissions
                  </TableHead>
                  <TableHead
                    className="w-16"
                    style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localRoles.map((role: Role) => (
                  <TableRow
                    key={role.id}
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <TableCell
                      className="font-medium text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {role.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border"
                        style={{
                          backgroundColor: 'var(--surface)',
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border-default)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {role.users}
                      </span>
                    </TableCell>
                    <TableCell
                      className="text-xs max-w-[300px] truncate"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {role.permissions}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => alert(`Editing permissions for ${role.name}`)}>
                        <Edit className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ── Add Role Modal ────────────────────────────────────── */}
          {isRoleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
              <div 
                className="w-full max-w-md rounded-xl border p-6 space-y-4 animate-fade-in-up"
                style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--primary-navy)' }}>
                    Add Custom Role
                  </h3>
                  <button 
                    onClick={() => setIsRoleModalOpen(false)}
                    className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <form onSubmit={handleAddRole} className="space-y-4">
                  <div>
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input 
                      id="roleName" 
                      placeholder="e.g. Facility Manager" 
                      value={newRoleName} 
                      onChange={(e) => setNewRoleName(e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="rolePerms">Permissions Outline</Label>
                    <Input 
                      id="rolePerms" 
                      placeholder="e.g. Read-write access to booking and maintenance logs" 
                      value={newRolePerms} 
                      onChange={(e) => setNewRolePerms(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" type="button" onClick={() => setIsRoleModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Role
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Security ─────────────────────────────────────────────── */}
        <TabsContent value="security">
          <div className="space-y-4 max-w-2xl">
            {/* Two-Factor Authentication */}
            <div
              className="rounded-xl border p-5 flex items-center justify-between"
              style={{
                backgroundColor: 'var(--elevated)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Two-Factor Authentication
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Require 2FA for all administrator accounts
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            {/* Session Timeout */}
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--elevated)',
                borderColor: 'var(--border-default)',
              }}
            >
              <p
                className="text-sm font-medium mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Session Timeout
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  defaultValue="30"
                  className="w-24"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                />
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  minutes
                </span>
              </div>
            </div>

            {/* Password Policy */}
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--elevated)',
                borderColor: 'var(--border-default)',
              }}
            >
              <p
                className="text-sm font-medium mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Password Policy
              </p>
              <ul className="space-y-2">
                {passwordRequirements.map((req) => (
                  <li key={req} className="flex items-center gap-2">
                    <CheckCircle2
                      className="size-4 shrink-0"
                      style={{ color: 'var(--status-success)' }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* ── Brand ────────────────────────────────────────────────── */}
        <TabsContent value="brand">
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border-default)',
            }}
          >
            <p
              className="text-[0.9375rem] font-medium mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Brand Colors
            </p>
            <div className="grid grid-cols-4 gap-4">
              {brandColors.map((swatch) => (
                <div key={swatch.name}>
                  <div
                    className="h-16 rounded-lg border"
                    style={{
                      backgroundColor: swatch.color,
                      borderColor: 'var(--border-default)',
                    }}
                  />
                  <p
                    className="text-sm font-medium mt-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {swatch.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {swatch.hex}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="text-xs mt-6"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Custom branding available on Enterprise plan
            </p>
          </div>
        </TabsContent>

        {/* ── Audit Logs ───────────────────────────────────────────── */}
        <TabsContent value="audit-logs">
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border-default)',
            }}
          >
            <Table>
              <TableHeader>
                <TableRow
                  style={{
                    backgroundColor: 'var(--canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    Timestamp
                  </TableHead>
                  <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    User
                  </TableHead>
                  <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    Action
                  </TableHead>
                  <TableHead style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogData.map((log) => (
                  <TableRow
                    key={log.id}
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <TableCell
                      className="text-sm font-mono"
                      style={{
                        color: 'var(--text-secondary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {log.timestamp}
                    </TableCell>
                    <TableCell
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {log.user}
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {log.action}
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── Integrations ─────────────────────────────────────────── */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-2 gap-4">
            {localIntegrations.map((integration: Integration) => (
              <div
                key={integration.id}
                className="rounded-xl border p-5"
                style={{
                  backgroundColor: 'var(--elevated)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {integration.name}
                    </p>
                    <span
                      className="inline-block text-xs mt-1 rounded-md px-1.5 py-0.5 border"
                      style={{
                        color: 'var(--text-tertiary)',
                        borderColor: 'var(--border-default)',
                        backgroundColor: 'var(--surface)',
                      }}
                    >
                      {integration.category}
                    </span>
                  </div>
                  <StatusBadge status={integration.status as any} />
                </div>
                <p
                  className="text-xs mb-4"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Last sync: {integration.lastSync}
                </p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => toggleIntegration(integration.id)}
                >
                  {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

