import { cn } from '../lib/cn'
import { Badge } from '../ui/badge'

type CategoryChipGroupProps = {
  items: { id: string; label: string; active?: boolean }[]
  onToggle?: (id: string) => void
  className?: string
  activeVariant?: 'primary' | 'primary-outline'
  inactiveVariant?: 'neutral' | 'neutral-outline'
  activeSize?: 'sm' | 'md' | 'lg'
  inactiveSize?: 'sm' | 'md' | 'lg'
}

export default function CategoryChipGroup({ items, onToggle, className, activeVariant = 'primary', inactiveVariant = 'neutral', activeSize = 'md', inactiveSize = 'md' }: CategoryChipGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-sm', className)}>
      {items.map((it) => (
        <button key={it.id} type="button" onClick={() => onToggle?.(it.id)} className="inline-flex cursor-pointer">
          <Badge variant={it.active ? activeVariant : inactiveVariant} size={it.active ? activeSize : inactiveSize}>{it.label}</Badge>
        </button>
      ))}
    </div>
  )
}
