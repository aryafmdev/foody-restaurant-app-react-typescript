import { Badge } from '../ui/badge'
import { MapPin } from 'lucide-react'

type MapPinChipProps = {
  label: string
}

export default function MapPinChip({ label }: MapPinChipProps) {
  return (
    <Badge variant="neutral" size="md">
      <span className="inline-flex items-center gap-xs">
        <MapPin size={14} />
        {label}
      </span>
    </Badge>
  )
}
