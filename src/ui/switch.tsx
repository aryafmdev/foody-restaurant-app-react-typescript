import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: string }

export function Switch({ className, label, ...props }: SwitchProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-sm">
      <input type="checkbox" className={cn('peer sr-only', className)} {...props} />
      <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-neutral-300 transition-colors peer-checked:bg-primary">
        <span className="absolute left-0.5 inline-block h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
      </span>
      {label ? <span className="text-sm text-neutral-900">{label}</span> : null}
    </label>
  )
}

export function SwitchLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm text-neutral-900', className)} {...props} />
}
