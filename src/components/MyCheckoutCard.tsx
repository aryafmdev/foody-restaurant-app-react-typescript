import { Card, CardContent, CardHeader } from '../ui/card';
import storeImg from '../assets/images/store.png';
import { Button } from '../ui/button';
import { Image } from '../ui/image';
import fallbackImg from '../assets/images/fallback-image.png';
import { cn } from '../lib/cn';
import { Icon } from '../ui/icon';
import { formatCurrency } from '../lib/format';

type Item = {
  title: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

type MyCheckoutCardProps = {
  storeName: string;
  onClickStore?: () => void;
  onAddItem?: () => void;
  items: Item[];
  onChangeItemQty?: (index: number, qty: number) => void;
  className?: string;
};

function CheckoutItemRow({
  title,
  price,
  imageUrl,
  quantity,
  onQuantityChange,
}: {
  title: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  onQuantityChange: (value: number) => void;
}) {
  const inc = () => onQuantityChange(quantity + 1);
  const dec = () => onQuantityChange(Math.max(0, quantity - 1));
  return (
    <div className='flex items-center justify-between'>
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
      <div className='inline-flex items-center gap-md'>
        <Button
          variant='outline'
          size='sm'
          className='!w-8 !h-8 !rounded-full !px-0 !py-0'
          onClick={dec}
        >
          <Icon name='ic:round-minus' size={18} className='text-neutral-900' />
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
    </div>
  );
}

export default function MyCheckoutCard({
  storeName,
  onClickStore,
  onAddItem,
  items,
  onChangeItemQty,
  className,
}: MyCheckoutCardProps) {
  return (
    <Card
      className={cn(
        'rounded-lg border-none',
        className
      )}
    >
      <CardHeader className='p-2xl pb-xl border-none'>
        <div className='flex items-center justify-between'>
          <div
            className='inline-flex items-center gap-sm cursor-pointer'
            onClick={onClickStore}
          >
            <img src={storeImg} alt='Store' className='h-6 w-6' />
            <span className='text-md md:text-lg font-bold text-neutral-950'>
              {storeName}
            </span>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full'
            onClick={onAddItem}
          >
            Add item
          </Button>
        </div>
      </CardHeader>
      <CardContent className='p-2xl'>
        <div className='space-y-2xl'>
          {items.map((it, i) => (
            <CheckoutItemRow
              key={`${it.title}-${i}`}
              title={it.title}
              price={it.price}
              imageUrl={it.imageUrl}
              quantity={it.quantity}
              onQuantityChange={(q: number) => onChangeItemQty?.(i, q)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
