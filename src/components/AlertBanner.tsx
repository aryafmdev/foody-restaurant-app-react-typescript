import { cn } from '../lib/cn'
import { Alert } from '../ui/alert'
import { Button } from '../ui/button'

type AlertBannerProps = {
  variant?: 'info' | 'success' | 'warning' | 'error'
  message: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export default function AlertBanner({ variant = 'info', message, actionLabel, onAction, className }: AlertBannerProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <Alert variant={variant} className="flex-1">{message}</Alert>
      {actionLabel ? <Button variant="neutral" className="ml-md" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  )
}
