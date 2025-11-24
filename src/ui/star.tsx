import type { HTMLAttributes } from 'react'
import { Star as LucideStar } from 'lucide-react'
import { cn } from '../lib/cn'

type StarProps = {
  filled?: boolean
  size?: number
} & HTMLAttributes<SVGSVGElement>

export function Star({ filled = false, size = 16, className, ...props }: StarProps) {
  return (
    <LucideStar
      width={size}
      height={size}
      className={cn(filled ? 'fill-primary text-primary' : 'text-neutral-500', className)}
      {...props}
    />
  )
}
