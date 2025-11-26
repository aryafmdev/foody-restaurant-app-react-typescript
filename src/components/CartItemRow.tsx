import { cn } from '../lib/cn'
import { Image } from '../ui/image'
import { Button } from '../ui/button'
import QuantityStepper from './QuantityStepper'
import { formatCurrency } from '../lib/format'
import { Icon } from '../ui/icon'

type CartItemRowProps = {
  title: string
  price: number
  imageUrl?: string | null
  quantity: number
  onQuantityChange: (value: number) => void
  onRemove?: () => void
  variant?: 'default' | 'cart'
  className?: string
}

export default function CartItemRow({ title, price, imageUrl, quantity, onQuantityChange, onRemove, variant = 'default', className }: CartItemRowProps) {
  const dec = () => onQuantityChange(Math.max(0, quantity - 1))
  const inc = () => onQuantityChange(quantity + 1)
  return (
    <div className={cn('flex items-center gap-md', className)}>
      <div className="h-16 w-16 rounded-lg overflow-hidden bg-neutral-200">
        {imageUrl ? <Image alt={title} src={imageUrl} className="h-full w-full" /> : null}
      </div>
      <div className="flex-1">
        <div className="text-sm md:text-md font-medium text-neutral-900">{title}</div>
        <div className="text-md md:text-lg font-extrabold text-neutral-900">{formatCurrency(price, 'IDR')}</div>
      </div>
      {variant === 'cart' ? (
        <div className="inline-flex items-center gap-md">
          <Button variant="outline" size="sm" className="!w-10 !h-10 !rounded-full !px-0 !py-0" onClick={dec}>
            <Icon name="ic:round-minus" size={18} className="text-neutral-900" />
          </Button>
          <span className="w-6 text-center text-md text-neutral-900">{quantity}</span>
          <Button variant="primary" size="sm" className="!w-10 !h-10 !rounded-full !px-0 !py-0" onClick={inc}>
            <Icon name="material-symbols:add-rounded" size={20} className="text-white" />
          </Button>
        </div>
      ) : (
        <>
          <QuantityStepper value={quantity} onChange={onQuantityChange} />
          <Button size="sm" variant="danger" onClick={onRemove}>Remove</Button>
        </>
      )}
    </div>
  )
}
