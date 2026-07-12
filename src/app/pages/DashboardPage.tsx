import { useState } from 'react';
import { Link } from 'react-router';
import KPICard from '@/app/components/KPICard';
import StatusBadge from '@/app/components/StatusBadge';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import {
  kpiData,
  recentActivity,
  pendingApprovals as initialPendingApprovals,
  utilizationByCategory,
  assetHealthDistribution,
} from '@/app/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Package,
  UserCheck,
  PackageCheck,
  Clock,
  Plus,
  ArrowLeftRight,
  CalendarDays,
  ClipboardCheck,
} from 'lucide-react';

const activityDotColor: Record<string, string> = {
  allocation: 'var(--status-success)',
  transfer: 'var(--status-info)',
  maintenance: 'var(--status-warning)',
  audit: 'var(--primary-navy)',
  booking: 'var(--status-info)',
  system: 'var(--text-tertiary)',
};

export default function DashboardPage() {
  const [approvals, setApprovals] = useState(initialPendingApprovals);

  function handleApprove(id: string) {
    setApprovals(prev => prev.filter(item => item.id !== id));
  }

  function handleDecline(id: string) {
    setApprovals(prev => prev.filter(item => item.id !== id));
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your organization's assets and operations"
      />

      {/* ── Quick Actions ────────────────────────────────────── */}
      <div className="mb-6 flex gap-2">
        <Link to="/assets?new=true">
          <Button variant="secondary" size="sm">
            <Plus className="size-4" />
            New Asset
          </Button>
        </Link>
        <Link to="/transfer">
          <Button variant="secondary" size="sm">
            <ArrowLeftRight className="size-4" />
            Transfer
          </Button>
        </Link>
        <Link to="/booking">
          <Button variant="secondary" size="sm">
            <CalendarDays className="size-4" />
            Book Resource
          </Button>
        </Link>
        <Link to="/audit">
          <Button variant="secondary" size="sm">
            <ClipboardCheck className="size-4" />
            Run Audit
          </Button>
        </Link>
      </div>

      {/* ── KPI Row ──────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <KPICard
          label="Total Assets"
          value={kpiData.totalAssets}
          trend={{ value: 3.2, label: 'vs last month' }}
          icon={<Package className="size-4" />}
        />
        <KPICard
          label="Allocated"
          value={kpiData.allocated}
          trend={{ value: 1.8, label: 'vs last month' }}
          icon={<UserCheck className="size-4" />}
        />
        <KPICard
          label="Available"
          value={kpiData.available}
          trend={{ value: -2.1, label: 'vs last month' }}
          icon={<PackageCheck className="size-4" />}
        />
        <KPICard
          label="Pending Actions"
          value={kpiData.pendingTransfers + approvals.length}
          icon={<Clock className="size-4" />}
        />
      </div>

      {/* ── Main Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-[1.4fr_0.6fr] gap-6">
        {/* ── Left Column ─────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Recent Activity */}
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--elevated)',
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[0.9375rem] font-semibold"
                style={{ color: 'var(--primary-navy)' }}
              >
                Recent Activity
              </h2>
              <Link to="/notifications">
                <button
                  className="text-[0.75rem] font-medium cursor-pointer hover:underline"
                  style={{ color: 'var(--primary-navy)' }}
                >
                  View all
                </button>
              </Link>
            </div>

            <div className="flex flex-col">
              {recentActivity.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 py-3"
                  style={{
                    borderBottom:
                      idx < recentActivity.length - 1
                        ? '1px solid var(--border-default)'
                        : 'none',
                  }}
                >
                  <div
                    className="mt-1.5 shrink-0 rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: activityDotColor[item.type] || 'var(--text-tertiary)',
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="mt-0.5 text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.description}
                    </div>
                  </div>
                  <span
                    className="shrink-0 text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--elevated)',
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <h2
                className="text-[0.9375rem] font-semibold"
                style={{ color: 'var(--primary-navy)' }}
              >
                Pending Approvals
              </h2>
              <span
                className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium"
                style={{
                  backgroundColor: 'rgba(23, 42, 69, 0.08)',
                  color: 'var(--primary-navy)',
                }}
              >
                {approvals.length}
              </span>
            </div>

            {approvals.length === 0 ? (
              <div className="text-center py-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
                No pending approvals.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {approvals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg px-3 py-3 animate-fade-in"
                    style={{
                      backgroundColor: 'var(--surface)',
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide"
                          style={{
                            backgroundColor: 'var(--canvas)',
                            color: 'var(--text-tertiary)',
                            border: '1px solid var(--border-default)',
                          }}
                        >
                          {item.type}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {item.title}
                        </span>
                      </div>
                      <div
                        className="mt-1 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Requested by {item.requestedBy} · {item.date}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" onClick={() => handleApprove(item.id)}>Approve</Button>
                      <Button variant="secondary" size="sm" onClick={() => handleDecline(item.id)}>
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column ────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Utilization by Category */}
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--elevated)',
            }}
          >
            <h2
              className="mb-4 text-[0.9375rem] font-semibold"
              style={{ color: 'var(--primary-navy)' }}
            >
              Utilization by Category
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={utilizationByCategory}>
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--elevated)',
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value}%`, 'Utilization']}
                />
                <Bar
                  dataKey="utilized"
                  fill="var(--primary-navy)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Asset Health */}
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--elevated)',
            }}
          >
            <h2
              className="mb-4 text-[0.9375rem] font-semibold"
              style={{ color: 'var(--primary-navy)' }}
            >
              Asset Health
            </h2>
            <div className="flex justify-center">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={assetHealthDistribution}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {assetHealthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'var(--elevated)',
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {assetHealthDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span
                    className="text-[0.6875rem]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {entry.name}
                  </span>
                  <span
                    className="text-[0.6875rem] font-medium"
                    style={{
                      color: 'var(--text-primary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {entry.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
