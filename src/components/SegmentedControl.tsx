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
    <div className={cn('inline-flex items-center gap-none rounded-md border border-neutral-300', className)}>
      {options.map((opt) => (
        <Button key={opt.value} size="sm" variant={opt.value === value ? 'primary' : 'neutral'} className="rounded-none border-none" onClick={() => onChange(opt.value)}>
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
