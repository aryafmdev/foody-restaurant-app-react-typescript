import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../lib/cn'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent({ className, side = 'top', ...props }: TooltipPrimitive.TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content side={side} className={cn('z-50 rounded-md border border-neutral-200 bg-neutral-900 px-sm py-xxs text-xs text-white shadow-lg', className)} {...props} />
    </TooltipPrimitive.Portal>
  )
}
