import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type AlertProps = {
  variant?: 'info' | 'success' | 'warning' | 'error';
} & HTMLAttributes<HTMLDivElement>;

export function Alert({ variant = 'info', className, ...props }: AlertProps) {
  const variants = {
    info: 'bg-neutral-50 text-neutral-900 border-l-4 border-neutral-400',
    success: 'bg-accent-green text-white',
    warning:
      'bg-accent-yellow/10 text-neutral-900 border-l-4 border-accent-yellow',
    error: 'bg-primary text-white',
  }[variant];
  return (
    <div
      role='alert'
      className={cn('px-md py-sm rounded-md', variants, className)}
      {...props}
    />
  );
}
