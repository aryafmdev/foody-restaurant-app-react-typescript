import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type IconButtonProps = {
  size?: 'sm' | 'md'
  variant?: 'neutral' | 'ghost' | 'primary'
} & ButtonHTMLAttributes<HTMLButtonElement>

export function IconButton({ className, size = 'md', variant = 'neutral', ...props }: IconButtonProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
  }[size]
  const variants = {
    neutral: 'rounded-md bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    ghost: 'rounded-md bg-transparent text-neutral-900 hover:bg-neutral-100',
    primary: 'rounded-md bg-primary text-white hover:opacity-90',
  }[variant]
  return <button className={cn('inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none', sizes, variants, className)} {...props} />
}
