import { cn } from '../lib/cn'
import { Image } from '../ui/image'
import { Button } from '../ui/button'
import QuantityStepper from './QuantityStepper'
import { formatCurrency } from '../lib/format'

type CartItemRowProps = {
  title: string
  price: number
  imageUrl?: string | null
  quantity: number
  onQuantityChange: (value: number) => void
  onRemove?: () => void
  className?: string
}

export default function CartItemRow({ title, price, imageUrl, quantity, onQuantityChange, onRemove, className }: CartItemRowProps) {
  return (
    <div className={cn('flex items-center gap-md', className)}>
      <div className="h-16 w-16 rounded-md overflow-hidden bg-neutral-200">
        {imageUrl ? <Image alt={title} src={imageUrl} className="h-full w-full" /> : null}
      </div>
      <div className="flex-1">
        <div className="text-md font-semibold">{title}</div>
        <div className="text-sm text-neutral-700">{formatCurrency(price, 'IDR')}</div>
      </div>
      <QuantityStepper value={quantity} onChange={onQuantityChange} />
      <Button size="sm" variant="danger" onClick={onRemove}>Remove</Button>
    </div>
  )
}
