import { cn } from '../lib/cn';
import { IconButton } from '../ui/icon-button';
import type { ReactNode } from 'react';

type IconAction = {
  id: string;
  icon: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
};

type IconActionBarProps = {
  actions: IconAction[];
  className?: string;
};

export default function IconActionBar({
  actions,
  className,
}: IconActionBarProps) {
  return (
    <div className={cn('flex items-center gap-sm', className)}>
      {actions.map((a) => (
        <IconButton key={a.id} aria-label={a.ariaLabel} onClick={a.onClick}>
          {a.icon}
        </IconButton>
      ))}
    </div>
  );
}
