import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full px-2xl md:px-8xl', className)} {...props} />
}
