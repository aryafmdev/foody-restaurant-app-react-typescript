import { cn } from '../lib/cn';
import { Button } from '../ui/button';

type SegmentedControlProps = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  scrollable?: boolean;
};

export default function SegmentedControl({
  options,
  value,
  onChange,
  className,
  scrollable = false,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-md',
        scrollable
          ? 'w-full overflow-x-auto whitespace-nowrap md:overflow-visible md:flex-wrap md:whitespace-normal'
          : 'w-full flex-wrap',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Button
            key={opt.value}
            size='sm'
            variant='ghost'
            className={cn(
              'rounded-full bg-white text-neutral-950 border border-neutral-300 whitespace-nowrap shrink-0 md:px-md md:h-8 md:text-sm',
              active ? 'border-none font-extrabold' : 'font-medium'
            )}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}
