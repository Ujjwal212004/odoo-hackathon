import { assets, assetTimeline, maintenanceTasks } from '@/app/data/mockData';
import StatusBadge from '@/app/components/StatusBadge';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import EmptyState from '@/app/components/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  ArrowLeftRight,
  QrCode,
  Archive,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router';

const asset = assets[0];

const relatedAssets = [assets[1], assets[11]]; // MacBook Pro 14" and Jabra PanaCast

const timelineEventColor: Record<string, string> = {
  allocation: 'var(--status-success)',
  transfer: 'var(--status-info)',
  maintenance: 'var(--status-warning)',
  audit: 'var(--primary-navy)',
  system: 'var(--text-tertiary)',
};

function getHealthColor(score: number): string {
  if (score > 80) return 'var(--status-success)';
  if (score > 50) return 'var(--status-warning)';
  return 'var(--status-danger)';
}

function InfoRow({
  label,
  value,
  isLast = false,
  children,
}: {
  label: string;
  value?: string | number;
  isLast?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--border-default)',
      }}
    >
      <span
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </span>
      {children || (
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export default function AssetDetailPage() {
  const assetMaintenanceTasks = maintenanceTasks.filter(
    (t) => t.assetTag === asset.tag
  );

  return (
    <div>
      {/* ── Back Link ────────────────────────────────────────── */}
      <Link
        to="/assets"
        className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = 'var(--text-primary)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = 'var(--text-secondary)')
        }
      >
        <ArrowLeft className="size-4" />
        Back to Assets
      </Link>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{
              color: 'var(--primary-navy)',
              letterSpacing: 0,
              lineHeight: '1.2',
            }}
          >
            {asset.name}
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Asset Tag: {asset.tag}
          </p>
          <div className="mt-2">
            <StatusBadge status={asset.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => alert('Editing asset metadata is restricted to managers.')}>
            <Edit className="size-4" />
            Edit
          </Button>
          <Link to="/transfer">
            <Button variant="secondary" size="sm">
              <ArrowLeftRight className="size-4" />
              Transfer
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={() => alert(`QR Code metadata: tag=${asset.tag}`)}>
            <QrCode className="size-4" />
            QR Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            style={{ color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
            onClick={() => {
              if (confirm(`Are you sure you want to archive ${asset.name}?`)) {
                alert('Asset archived successfully.');
              }
            }}
          >
            <Archive className="size-4" />
            Archive
          </Button>
        </div>
      </div>


      {/* ── Tabs ─────────────────────────────────────────────── */}
      <Tabs defaultValue="overview">
        <TabsList
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 12,
          }}
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ───────────────────────────────────── */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-[1fr_380px] gap-6">
            {/* Left */}
            <div className="flex flex-col gap-6">
              {/* Asset Information */}
              <div
                className="rounded-lg border p-5"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--elevated)',
                }}
              >
                <h3
                  className="mb-3 text-[0.9375rem] font-semibold"
                  style={{ color: 'var(--primary-navy)' }}
                >
                  Asset Information
                </h3>
                <InfoRow label="Serial Number" value={asset.serialNumber} />
                <InfoRow label="Category" value={asset.category} />
                <InfoRow label="Purchase Date" value={asset.purchaseDate} />
                <InfoRow
                  label="Value"
                  value={`$${asset.value.toLocaleString()}`}
                />
                <InfoRow label="Health Score" isLast>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: 'var(--text-primary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {asset.healthScore}%
                    </span>
                    <div
                      className="h-1 w-24 overflow-hidden rounded-full"
                      style={{ backgroundColor: 'var(--surface)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${asset.healthScore}%`,
                          backgroundColor: getHealthColor(asset.healthScore),
                        }}
                      />
                    </div>
                  </div>
                </InfoRow>
              </div>

              {/* Assignment */}
              <div
                className="rounded-lg border p-5"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--elevated)',
                }}
              >
                <h3
                  className="mb-3 text-[0.9375rem] font-semibold"
                  style={{ color: 'var(--primary-navy)' }}
                >
                  Assignment
                </h3>
                <InfoRow label="Owner" value={asset.owner} />
                <InfoRow label="Department" value={asset.department} />
                <InfoRow label="Location" value={asset.location} isLast />
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-6">
              {/* Quick Stats */}
              <div
                className="rounded-lg border p-5"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--elevated)',
                }}
              >
                <h3
                  className="mb-3 text-[0.9375rem] font-semibold"
                  style={{ color: 'var(--primary-navy)' }}
                >
                  Quick Stats
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Total Allocations', value: '4' },
                    { label: 'Maintenance Events', value: '3' },
                    { label: 'Days Since Last Audit', value: '92' },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {stat.label}
                      </span>
                      <span
                        className="text-lg font-semibold"
                        style={{
                          color: 'var(--primary-navy)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Assets */}
              <div
                className="rounded-lg border p-5"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--elevated)',
                }}
              >
                <h3
                  className="mb-3 text-[0.9375rem] font-semibold"
                  style={{ color: 'var(--primary-navy)' }}
                >
                  Related Assets
                </h3>
                <div className="flex flex-col gap-3">
                  {relatedAssets.map((ra) => (
                    <div
                      key={ra.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: 'var(--surface)' }}
                    >
                      <div>
                        <span
                          className="font-mono text-xs font-medium"
                          style={{ color: 'var(--primary-navy)' }}
                        >
                          {ra.tag}
                        </span>
                        <span
                          className="ml-2 text-sm"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {ra.name}
                        </span>
                      </div>
                      <StatusBadge status={ra.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Timeline Tab ───────────────────────────────────── */}
        <TabsContent value="timeline" className="mt-6">
          <div
            className="rounded-lg border p-5"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--elevated)',
            }}
          >
            <div className="relative">
              {assetTimeline.map((entry, idx) => (
                <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Date */}
                  <div
                    className="w-24 shrink-0 pt-0.5 text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {entry.date}
                  </div>

                  {/* Dot + Line */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className="z-10 size-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          timelineEventColor[entry.type] || 'var(--text-tertiary)',
                      }}
                    />
                    {idx < assetTimeline.length - 1 && (
                      <div
                        className="absolute left-1/2 top-2.5 w-px -translate-x-1/2"
                        style={{
                          backgroundColor: 'var(--border-default)',
                          height: 'calc(100% + 4px)',
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pb-2">
                    <div
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {entry.event}
                    </div>
                    <div
                      className="mt-0.5 text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {entry.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── Maintenance Tab ────────────────────────────────── */}
        <TabsContent value="maintenance" className="mt-6">
          {assetMaintenanceTasks.length === 0 ? (
            <EmptyState
              title="No maintenance tasks"
              description="There are no maintenance tasks for this asset."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {assetMaintenanceTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border p-5"
                  style={{
                    borderColor: 'var(--border-default)',
                    backgroundColor: 'var(--elevated)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {task.title}
                      </h4>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {task.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                  <div
                    className="mt-3 flex items-center gap-4 text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <span>
                      Assignee:{' '}
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {task.assignee}
                      </span>
                    </span>
                    <span>
                      Created:{' '}
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {task.createdDate}
                      </span>
                    </span>
                    <span>
                      Reported by:{' '}
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {task.reportedBy}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Documents Tab ──────────────────────────────────── */}
        <TabsContent value="documents" className="mt-6">
          <div
            className="rounded-lg border"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--elevated)',
            }}
          >
            <EmptyState
              icon={<FileText className="size-6" />}
              title="No documents"
              description="Upload documents related to this asset."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
