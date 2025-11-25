import { cn } from '../lib/cn'
import { Button } from '../ui/button'
import MapPinChip from './MapPinChip'

type AddressSummaryRowProps = {
  address: string
  onEdit?: () => void
  className?: string
}

export default function AddressSummaryRow({ address, onEdit, className }: AddressSummaryRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-md', className)}>
      <MapPinChip label={address} />
      <Button variant="neutral" size="sm" onClick={onEdit}>Edit</Button>
    </div>
  )
}
