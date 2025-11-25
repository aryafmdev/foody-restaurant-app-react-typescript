import { cn } from '../lib/cn'
import { Button } from '../ui/button'

type QuantityStepperProps = {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  className?: string
}

export default function QuantityStepper({ value, min = 1, max, onChange, className }: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(max ? Math.min(max, value + 1) : value + 1)
  return (
    <div className={cn('inline-flex items-center gap-sm', className)}>
      <Button size="sm" variant="neutral" onClick={dec} disabled={value <= min}>-</Button>
      <div className="w-10 text-center">{value}</div>
      <Button size="sm" variant="neutral" onClick={inc}>+</Button>
    </div>
  )
}
