import { cn } from '../lib/cn';
import { Button } from '../ui/button';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-2xl',
        className
      )}
    >
      {icon ? <div className='mb-md'>{icon}</div> : null}
      <div className='text-md font-semibold'>{title}</div>
      {description ? (
        <div className='mt-xs text-sm text-neutral-700'>{description}</div>
      ) : null}
      {actionLabel ? (
        <Button className='mt-lg' onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
