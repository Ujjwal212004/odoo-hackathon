import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
}

export default function KPICard({ label, value, trend, icon }: KPICardProps) {
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString()
    : value;

  return (
    <div
      className="rounded-lg border p-5"
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--elevated)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="text-[0.8125rem] font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </div>
        {icon && (
          <div
            className="flex size-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: 'var(--accent-brass-muted)',
              color: 'var(--primary-navy)',
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div
        className="mt-2 text-[1.75rem] font-semibold"
        style={{
          color: 'var(--primary-navy)',
          letterSpacing: 0,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: '1.1',
        }}
      >
        {formattedValue}
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-[0.75rem]">
          {trend.value > 0 ? (
            <TrendingUp className="size-3.5" style={{ color: 'var(--status-success)' }} />
          ) : trend.value < 0 ? (
            <TrendingDown className="size-3.5" style={{ color: 'var(--status-danger)' }} />
          ) : (
            <Minus className="size-3.5" style={{ color: 'var(--text-tertiary)' }} />
          )}
          <span
            style={{
              color: trend.value > 0
                ? 'var(--status-success)'
                : trend.value < 0
                  ? 'var(--status-danger)'
                  : 'var(--text-tertiary)',
            }}
          >
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
