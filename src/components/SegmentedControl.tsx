import { cn } from '../lib/cn'
import { Button } from '../ui/button'

type SegmentedControlProps = {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn('inline-flex items-center gap-none rounded-sm bg-neutral-100 p-sm', className)}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <Button
            key={opt.value}
            size="sm"
            variant="ghost"
            className={cn(
              'rounded-sm',
              active
                ? 'bg-white text-neutral-950 font-bold shadow-sm border border-neutral-300'
                : 'bg-transparent text-neutral-500 font-medium hover:bg-neutral-100'
            )}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        )
      })}
    </div>
  )
}
