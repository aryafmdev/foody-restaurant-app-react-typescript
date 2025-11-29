import { DialogTitle, DialogClose } from '../ui/dialog';
import { Icon } from '../ui/icon';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

type GiveReviewCardProps = {
  title?: string;
  rating: number;
  onRatingChange: (value: number) => void;
  comment: string;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
  pending?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function GiveReviewCard({
  title = 'Give Review',
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  onSubmit,
  pending = false,
  disabled = false,
  className,
}: GiveReviewCardProps) {
  return (
    <div className={['rounded-2xl', className].filter(Boolean).join(' ')}>
      <div className='flex items-center justify-between'>
        <DialogTitle className='text-lg font-extrabold text-neutral-950'>{title}</DialogTitle>
        <DialogClose asChild>
          <button aria-label='Close'>
            <Icon name='iconamoon:close' size={20} className='text-neutral-900' />
          </button>
        </DialogClose>
      </div>

      <div className='mt-md text-sm font-bold text-neutral-900 text-center'>Give Rating</div>
      <div className='mt-sm flex items-center justify-center gap-xs'>
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type='button'
            aria-label={`Rate ${i + 1}`}
            onClick={() => onRatingChange(i + 1)}
          >
            <Icon
              name={i < rating ? 'material-symbols:star-rounded' : 'material-symbols:star-outline-rounded'}
              size={22}
              className={i < rating ? 'text-accent-yellow' : 'text-neutral-500'}
            />
          </button>
        ))}
      </div>

      <div className='mt-xl'>
        <Textarea
          placeholder='Please share your thoughts about our service!'
          uiSize='lg'
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
      </div>

      <div className='mt-xl'>
        <Button
          variant='primary'
          size='md'
          className='w-full rounded-full h-12'
          onClick={onSubmit}
          disabled={pending || disabled}
        >
          {pending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}

