import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './icon';
import { useEffect, useRef } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  uiSize?: 'sm' | 'md';
  variant?: 'primary' | 'neutral';
  indeterminate?: boolean;
};

export function Checkbox({
  className,
  uiSize = 'md',
  variant = 'primary',
  indeterminate = false,
  disabled,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const dims = uiSize === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const baseBox = 'inline-block rounded-xs border bg-white transition-colors';
  const isChecked = !!props.checked;
  const states = cn(
    'border-neutral-300',
    variant === 'primary'
      ? cn(
          isChecked && 'bg-primary border-primary',
          'peer-checked:bg-primary peer-checked:border-primary'
        )
      : cn(
          isChecked && 'bg-neutral-900 border-neutral-900',
          'peer-checked:bg-neutral-900 peer-checked:border-neutral-900'
        ),
    'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40',
    'peer-disabled:bg-neutral-200 peer-disabled:border-neutral-300'
  );

  const iconSize = uiSize === 'sm' ? 14 : 16;

  return (
    <label className={cn('relative inline-flex items-center', className)}>
      <input
        type='checkbox'
        ref={ref}
        className='peer sr-only'
        disabled={disabled}
        {...props}
      />
      <span className={cn(baseBox, dims, states)} />
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none',
          dims
        )}
      >
        {indeterminate ? (
          <Icon
            name='material-symbols:remove'
            size={iconSize}
            className='text-white'
          />
        ) : (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox='0 0 24 24'
            className={cn(
              'opacity-0 transition-opacity',
              isChecked && 'opacity-100',
              'peer-checked:opacity-100'
            )}
          >
            <path
              d='M20 6L9 17l-5-5'
              fill='none'
              stroke='white'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        )}
      </span>
    </label>
  );
}

export function CheckboxLabel({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('ml-sm text-sm text-neutral-900', className)}
      {...props}
    />
  );
}
