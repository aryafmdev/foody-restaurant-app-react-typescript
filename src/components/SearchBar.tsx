import { cn } from '../lib/cn';
import { Input } from '../ui/input';
import { Icon } from '../ui/icon';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Icon name='mingcute:search-line' size={20} className='absolute left-2xl top-1/2 -translate-y-1/2 text-neutral-500' />
      <Input
        type='search'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        uiSize='lg'
        className='rounded-full pl-10 placeholder:text-md placeholder:text-neutral-600'
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit?.();
        }}
      />
    </div>
  );
}
