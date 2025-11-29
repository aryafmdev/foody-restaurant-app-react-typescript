import { cn } from '../lib/cn'
import { Button } from '../ui/button'
import MapPinChip from './MapPinChip'

type AddressSummaryRowProps = {
  address: string
  onEdit?: () => void
  editLabel?: string
  className?: string
}

export default function AddressSummaryRow({ address, onEdit, editLabel = 'Edit', className }: AddressSummaryRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-md', className)}>
      <MapPinChip label={address} />
      <Button variant="outline" size="sm" onClick={onEdit}>{editLabel}</Button>
    </div>
  )
}
