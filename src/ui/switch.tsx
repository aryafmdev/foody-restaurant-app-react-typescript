import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
};

export function Switch({ className, label, ...props }: SwitchProps) {
  return (
    <label className='inline-flex cursor-pointer items-center gap-sm'>
      <input
        type='checkbox'
        className={cn('peer sr-only', className)}
        {...props}
      />
      <span className='relative inline-block h-5 w-9 rounded-full bg-neutral-300 transition-colors peer-checked:bg-primary after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4' />
      {label ? <span className='text-sm text-neutral-900'>{label}</span> : null}
    </label>
  );
}

export function SwitchLabel({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('text-sm text-neutral-900', className)} {...props} />
  );
}
