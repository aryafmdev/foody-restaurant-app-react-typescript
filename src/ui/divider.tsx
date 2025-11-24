import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export function Divider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn('border-neutral-200', className)} {...props} />
}
