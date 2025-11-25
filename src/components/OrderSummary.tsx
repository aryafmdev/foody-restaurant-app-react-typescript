import { cn } from '../lib/cn'
import { formatCurrency } from '../lib/format'

type OrderSummaryProps = {
  subtotal: number
  serviceFee: number
  deliveryFee: number
  total: number
  currency?: 'IDR' | 'USD'
  className?: string
}

export default function OrderSummary({ subtotal, serviceFee, deliveryFee, total, currency = 'IDR', className }: OrderSummaryProps) {
  return (
    <div className={cn('space-y-sm', className)}>
      <div className="flex items-center justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal, currency)}</span></div>
      <div className="flex items-center justify-between text-sm"><span>Service Fee</span><span>{formatCurrency(serviceFee, currency)}</span></div>
      <div className="flex items-center justify-between text-sm"><span>Delivery Fee</span><span>{formatCurrency(deliveryFee, currency)}</span></div>
      <div className="flex items-center justify-between text-md font-semibold"><span>Total</span><span>{formatCurrency(total, currency)}</span></div>
    </div>
  )
}
