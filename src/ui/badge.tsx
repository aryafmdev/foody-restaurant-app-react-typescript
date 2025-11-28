import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-sm py-xxs text-xs',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-900',
        primary: 'bg-primary text-white',
        neutral: 'bg-neutral-200 text-neutral-900',
        success: 'bg-accent-green text-white',
        warning: 'bg-accent-yellow text-neutral-900',
        error: 'bg-accent-red text-white',
        'primary-outline': 'bg-white text-accent-red border border-accent-red',
        'neutral-outline':
          'bg-white text-neutral-900 border border-neutral-300',
      },
      size: {
        sm: 'text-xs px-xs py-xxs',
        md: 'text-sm px-sm py-xxs',
        lg: 'text-sm px-md py-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

type BadgeProps = VariantProps<typeof badgeVariants> &
  HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
