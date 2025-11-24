import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '../lib/cn'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectGroup = SelectPrimitive.Group
export const SelectLabel = SelectPrimitive.Label

export function SelectTrigger({ className, ...props }: SelectPrimitive.SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger className={cn('inline-flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-md text-md text-neutral-900 hover:bg-neutral-50', className)} {...props} />
  )
}

export function SelectContent({ className, children, ...props }: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn('z-50 min-w-[12rem] overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg', className)} {...props}>
        <SelectPrimitive.Viewport className="p-xxs">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export function SelectItem({ className, ...props }: SelectPrimitive.SelectItemProps) {
  return (
    <SelectPrimitive.Item className={cn('flex cursor-pointer select-none items-center rounded-sm px-md py-xs text-md text-neutral-900 focus:bg-neutral-100', className)} {...props} />
  )
}
