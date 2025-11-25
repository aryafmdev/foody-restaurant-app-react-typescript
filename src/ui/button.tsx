import type { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-neutral-25 font-bold hover:opacity-90',
        secondary: 'bg-neutral-300 text-neutral-950 font-bold hover:opacity-90',
        neutral: 'bg-neutral-100 text-neutral-900 font-bold hover:bg-neutral-200',
        danger: 'bg-accent-red text-white font-bold hover:opacity-90',
        outline:
          'border border-neutral-300 text-neutral-900 font-bold hover:bg-neutral-50',
        ghost: 'bg-transparent text-neutral-900 font-bold hover:bg-neutral-50',
        link: 'bg-transparent text-primary font-bold underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-xl md:px-6xl text-sm rounded-full',
        md: 'h-10 px-2xl md:px-7xl text-md rounded-full',
        lg: 'h-12 px-3xl md:px-8xl text-lg rounded-full',
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
