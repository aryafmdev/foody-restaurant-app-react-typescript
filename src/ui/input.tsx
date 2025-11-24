import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type InputProps = {
  variant?: 'default' | 'success' | 'error';
  uiSize?: 'sm' | 'md' | 'lg';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export function Input({
  className,
  variant = 'default',
  uiSize = 'md',
  ...props
}: InputProps) {
  const base =
    'w-full outline-none transition-colors placeholder:text-neutral-500';
  const sizes = {
    sm: 'h-8 px-sm text-sm rounded-sm',
    md: 'h-10 px-md text-md rounded-md',
    lg: 'h-12 px-xl text-lg rounded-lg',
  }[uiSize];
  const variants = {
    default:
      'bg-white border border-neutral-300 text-neutral-900 focus:border-neutral-400',
    success:
      'bg-white border border-accent-green text-neutral-900 focus:border-accent-green',
    error:
      'bg-white border border-primary text-neutral-900 focus:border-primary',
  }[variant];
  return <input className={cn(base, sizes, variants, className)} {...props} />;
}
