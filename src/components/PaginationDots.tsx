import { cn } from '../lib/cn'
import { Dot } from '../ui/dot'

type PaginationDotsProps = {
  count: number
  current: number
  onChange?: (index: number) => void
  className?: string
}

export default function PaginationDots({ count, current, onChange, className }: PaginationDotsProps) {
  return (
    <div className={cn('flex items-center gap-xs', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <button key={i} type="button" onClick={() => onChange?.(i)}>
          <Dot active={i === current} />
        </button>
      ))}
    </div>
  )
}
