import { cn } from '../lib/cn';
import { Image } from '../ui/image';
import fallbackImg from '../assets/images/fallback-image.png';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { formatCurrency } from '../lib/format';

type CartItemRowProps = {
  title: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onRemove?: () => void;
  variant?: 'default' | 'cart';
  className?: string;
};

export default function CartItemRow({
  title,
  price,
  imageUrl,
  quantity,
  onQuantityChange,
  onRemove,
  variant = 'default',
  className,
}: CartItemRowProps) {
  const inc = () => onQuantityChange(quantity + 1);
  const dec = () => onQuantityChange(Math.max(0, quantity - 1));
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className='flex items-center gap-md'>
        <div className='h-[64px] w-[64px] rounded-lg overflow-hidden bg-neutral-200'>
          <Image
            alt={title}
            src={imageUrl || fallbackImg}
            fallbackSrc={fallbackImg}
            className='!h-[64px] !w-[64px] object-cover'
          />
        </div>
        <div>
          <div className='text-sm font-medium text-neutral-900'>{title}</div>
          <div className='text-md font-extrabold text-neutral-900'>
            {formatCurrency(price, 'IDR')}
          </div>
        </div>
      </div>
      {variant === 'cart' ? (
        <div className='inline-flex items-center gap-md'>
          <Button
            variant='outline'
            size='sm'
            className='!w-8 !h-8 !rounded-full !px-0 !py-0'
            onClick={dec}
          >
            <Icon
              name='ic:round-minus'
              size={18}
              className='text-neutral-900'
            />
          </Button>
          <span className='w-6 text-center text-md text-neutral-900'>
            {quantity}
          </span>
          <Button
            variant='primary'
            size='sm'
            className='!w-8 !h-8 !rounded-full !px-0 !py-0'
            onClick={inc}
          >
            <Icon
              name='material-symbols:add-rounded'
              size={20}
              className='text-white'
            />
          </Button>
        </div>
      ) : (
        <div className='inline-flex items-center gap-sm'>
          <Button size='sm' variant='neutral' onClick={dec}>
            -
          </Button>
          <div className='w-8 text-center'>{quantity}</div>
          <Button size='sm' variant='neutral' onClick={inc}>
            +
          </Button>
          {onRemove ? (
            <Button size='sm' variant='danger' onClick={onRemove}>
              Remove
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
