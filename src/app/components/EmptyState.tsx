import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="mb-4 flex size-12 items-center justify-center rounded-xl"
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text-tertiary)',
        }}
      >
        {icon || <Inbox className="size-6" />}
      </div>
      <h3
        className="text-[0.9375rem] font-medium"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <p
        className="mt-1 max-w-sm text-[0.8125rem]"
        style={{ color: 'var(--text-secondary)' }}
      >
        {description}
      </p>
      {action && (
        <Button
          className="mt-4"
          onClick={action.onClick}
          size="sm"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
