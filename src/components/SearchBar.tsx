import { cn } from '../lib/cn';
import { Input } from '../ui/input';
import { IconButton } from '../ui/icon-button';
import { Search } from 'lucide-react';

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
    <div className={cn('flex items-center gap-sm', className)}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <IconButton aria-label='Search' onClick={onSubmit}>
        <Search size={18} />
      </IconButton>
    </div>
  );
}
