import {
  utilizationByCategory,
  assetHealthDistribution,
  monthlyMaintenanceData,
  assetsByLifecycleStage,
  kpiData,
} from '@/app/data/mockData';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const executiveMetrics = [
    { label: 'Total Assets', value: kpiData.totalAssets.toLocaleString() },
    { label: 'Utilization Rate', value: `${kpiData.utilizationRate}%` },
    { label: 'Active Maintenance', value: kpiData.underMaintenance.toString() },
    { label: 'Due for Retirement', value: '23' },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Enterprise analytics and operational insights"
        actions={
          <>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border"
              style={{
                backgroundColor: 'var(--elevated)',
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-default)',
              }}
            >
              <Calendar className="size-3.5" />
              July 2025
            </span>
            <Button variant="secondary">
              <Download />
              Export
            </Button>
          </>
        }
      />

      {/* ── Executive Summary ────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {executiveMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border p-5"
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border-default)',
            }}
          >
            <p
              className="text-xs uppercase tracking-wide"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {metric.label}
            </p>
            <p
              className="text-2xl font-semibold mt-1"
              style={{
                color: 'var(--primary-navy)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Charts Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Utilization by Category */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <p
            className="text-[0.9375rem] font-medium mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Utilization by Category
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={utilizationByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                axisLine={{ stroke: 'var(--border-default)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="utilized" fill="var(--primary-navy)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Health Distribution */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <p
            className="text-[0.9375rem] font-medium mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Asset Health
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={assetHealthDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                dataKey="value"
                strokeWidth={0}
              >
                {assetHealthDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            {assetHealthDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {entry.name}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: 'var(--text-primary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Trend */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <p
            className="text-[0.9375rem] font-medium mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Maintenance Trend
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyMaintenanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                axisLine={{ stroke: 'var(--border-default)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="var(--primary-navy)"
                strokeWidth={2}
                dot={{ r: 4, fill: 'var(--primary-navy)', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: 'var(--primary-navy)', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lifecycle Distribution */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <p
            className="text-[0.9375rem] font-medium mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Lifecycle Distribution
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={assetsByLifecycleStage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                axisLine={{ stroke: 'var(--border-default)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="var(--primary-navy)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
