import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export function Radio({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <input
      type="radio"
      className={cn('appearance-none inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-300 bg-white checked:border-primary checked:outline checked:outline-2 checked:outline-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40', className)}
      {...props}
    />
  )
}

export function RadioLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('ml-sm text-sm text-neutral-900', className)} {...props} />
}
