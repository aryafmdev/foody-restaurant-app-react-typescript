import { cn } from '../lib/cn'
import { Badge } from '../ui/badge'

type CategoryChipGroupProps = {
  items: { id: string; label: string; active?: boolean }[]
  onToggle?: (id: string) => void
  className?: string
}

export default function CategoryChipGroup({ items, onToggle, className }: CategoryChipGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-sm', className)}>
      {items.map((it) => (
        <button key={it.id} type="button" onClick={() => onToggle?.(it.id)} className="inline-flex">
          <Badge variant={it.active ? 'primary' : 'neutral'} size="md">{it.label}</Badge>
        </button>
      ))}
    </div>
  )
}
