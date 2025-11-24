import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type DotProps = {
  active?: boolean
  size?: 'sm' | 'md'
} & HTMLAttributes<HTMLDivElement>

export function Dot({ active = false, size = 'md', className, ...props }: DotProps) {
  const sizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
  }[size]
  return <div className={cn('rounded-full', sizes, active ? 'bg-primary' : 'bg-neutral-300', className)} {...props} />
}
