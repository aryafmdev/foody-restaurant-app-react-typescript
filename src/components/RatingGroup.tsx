import { cn } from '../lib/cn';
import { Star } from '../ui/star';

type RatingGroupProps = {
  rating: number;
  count?: number;
  color?: 'primary' | 'accent-yellow';
  className?: string;
};

export default function RatingGroup({
  rating,
  count,
  color = 'primary',
  className,
}: RatingGroupProps) {
  const full = Math.round(rating);
  return (
    <div className={cn('inline-flex items-center gap-xxs', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          filled={i < full}
          className={
            color === 'accent-yellow' ? 'text-accent-yellow' : undefined
          }
        />
      ))}
      {typeof count === 'number' ? (
        <span className='ml-xs text-sm text-neutral-700'>({count})</span>
      ) : null}
    </div>
  );
}
