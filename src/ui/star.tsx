import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './icon';

type StarProps = {
  filled?: boolean;
  size?: number;
} & Pick<HTMLAttributes<HTMLSpanElement>, 'className'>;

export function Star({ filled = false, size = 16, className }: StarProps) {
  const name = filled
    ? 'material-symbols:star'
    : 'material-symbols:star-outline';
  return (
    <Icon
      name={name}
      size={size}
      className={cn(filled ? 'text-primary' : 'text-neutral-500', className)}
    />
  );
}
