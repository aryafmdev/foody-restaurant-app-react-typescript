import { Container } from '../ui/container'
import { Icon } from '../ui/icon'
import { Button } from '../ui/button'
import { cn } from '../lib/cn'
import { formatCurrency } from '../lib/format'

type StickyCheckoutBarProps = {
  itemsCount: number
  totalPrice: number
  onCheckout: () => void
  iconName?: string
  buttonLabel?: string
  visible?: boolean
  showOnMobileOnly?: boolean
  className?: string
}

export default function StickyCheckoutBar({ itemsCount, totalPrice, onCheckout, iconName = 'lets-icons:bag-fill', buttonLabel = 'Checkout', visible = true, showOnMobileOnly = true, className, }: StickyCheckoutBarProps) {
  if (!visible) return null
  return (
    <div className={cn('fixed bottom-0 left-0 right-0 z-50', showOnMobileOnly ? 'md:hidden' : undefined, className)}>
      <div className='border-t border-neutral-200 bg-white shadow-lg'>
        <Container className='py-md flex items-center justify-between'>
          <div>
            <div className='inline-flex items-center gap-xs text-neutral-900'>
              <Icon name={iconName} size={18} className='text-neutral-950' />
              <span className='text-md font-semibold'>{itemsCount} Items</span>
            </div>
            <div className='mt-xxs text-md font-extrabold text-neutral-900'>
              {formatCurrency(totalPrice, 'IDR')}
            </div>
          </div>
          <Button variant='primary' size='md' className='rounded-full px-2xl h-11 font-bold' onClick={onCheckout}>
            {buttonLabel}
          </Button>
        </Container>
      </div>
    </div>
  )
}
