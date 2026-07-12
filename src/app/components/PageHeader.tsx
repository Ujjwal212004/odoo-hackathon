import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1
          className="text-2xl font-semibold"
          style={{
            color: 'var(--primary-navy)',
            letterSpacing: '-0.025em',
            lineHeight: '1.2',
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-1 text-[0.875rem]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
