import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type TextareaProps = {
  uiSize?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'success' | 'error';
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>;

export function Textarea({
  className,
  uiSize = 'md',
  state = 'default',
  ...props
}: TextareaProps) {
  const sizes = {
    sm: 'h-24 text-sm',
    md: 'h-28 text-md',
    lg: 'h-36 text-md',
  }[uiSize];
  const states = {
    default: 'border-neutral-300 focus:border-neutral-400',
    success: 'border-accent-green focus:border-accent-green',
    error: 'border-primary focus:border-primary',
  }[state];
  return (
    <textarea
      className={cn(
        'w-full rounded-md border bg-white px-md py-xs text-neutral-900 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-300',
        sizes,
        states,
        className
      )}
      {...props}
    />
  );
}
