import { cn } from '../lib/cn'
import { Badge } from '../ui/badge'
import { formatCurrency } from '../lib/format'

type PriceWithBadgeProps = {
  price: number
  currency?: 'IDR' | 'USD'
  badgeText?: string
  className?: string
}

export default function PriceWithBadge({ price, currency = 'IDR', badgeText, className }: PriceWithBadgeProps) {
  return (
    <div className={cn('flex items-center gap-sm', className)}>
      <span className="text-md font-semibold text-neutral-900">{formatCurrency(price, currency)}</span>
      {badgeText ? <Badge variant="primary" size="sm">{badgeText}</Badge> : null}
    </div>
  )
}
