import type { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:opacity-90',
        secondary: 'bg-neutral-900 text-white hover:opacity-90',
        neutral: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        danger: 'bg-accent-red text-white hover:opacity-90',
        outline:
          'border border-neutral-300 text-neutral-900 hover:bg-neutral-50',
        ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-50',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-sm text-sm rounded-sm',
        md: 'h-10 px-md text-md rounded-md',
        lg: 'h-12 px-xl text-lg rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
