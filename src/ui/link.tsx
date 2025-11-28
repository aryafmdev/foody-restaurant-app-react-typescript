import type { AnchorHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type LinkProps = {
  variant?: 'default' | 'muted' | 'underline'
} & AnchorHTMLAttributes<HTMLAnchorElement>

export function Link({ className, variant = 'default', ...props }: LinkProps) {
  const variants = {
    default: 'text-primary hover:opacity-90 focus-visible:underline',
    muted: 'text-neutral-700 hover:text-neutral-900',
    underline: 'text-primary underline underline-offset-4',
  }[variant]
  return <a className={cn('inline-flex items-center transition-colors cursor-pointer', variants, className)} {...props} />
}
