import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { formatCurrency } from '../lib/format';
import imageDefault from '../assets/images/image.png';
import { useState } from 'react';

type ProductCardProps = {
  title: string;
  price: number;
  imageUrl?: string | null;
  initialQty?: number;
  onQuantityChange?: (qty: number) => void;
};

export default function ProductCard({
  title,
  price,
  imageUrl,
  initialQty = 0,
  onQuantityChange,
}: ProductCardProps) {
  const [qty, setQty] = useState<number>(initialQty);
  const img = imageUrl ?? imageDefault;
  const add = () => {
    const next = qty > 0 ? qty : 1;
    setQty(next);
    onQuantityChange?.(next);
  };
  const dec = () => {
    const next = Math.max(0, qty - 1);
    setQty(next);
    onQuantityChange?.(next);
  };
  const inc = () => {
    const next = qty + 1;
    setQty(next);
    onQuantityChange?.(next);
  };
  return (
    <Card className='overflow-hidden rounded-lg shadow-md md:shadow-lg border-none'>
      <CardHeader className='p-none'>
        <img src={img} alt={title} className='w-full h-auto block' />
      </CardHeader>
      <CardContent className='p-lg md:p-2xl'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-md'>
          <div>
            <div className='text-md md:text-lg text-neutral-950'>{title}</div>
            <div className='mt-xxs text-md md:text-lg font-extrabold text-neutral-900'>
              {formatCurrency(price, 'IDR')}
            </div>
          </div>
          {qty === 0 ? (
            <Button
              variant='primary'
              size='md'
              className='w-full md:w-auto md:mt-none mt-lg'
              onClick={add}
            >
              Add
            </Button>
          ) : (
            <div className='inline-flex items-center gap-md'>
              <Button
                variant='outline'
                size='sm'
                className='!w-10 !h-10 !rounded-full !px-0 !py-0 leading-none shrink-0'
                onClick={dec}
              >
                <Icon
                  name='ic:round-minus'
                  size={20}
                  className='text-neutral-900'
                />
              </Button>
              <span className='min-w-6 text-center text-md md:text-lg text-neutral-900'>
                {qty}
              </span>
              <Button
                variant='primary'
                size='sm'
                className='!w-10 !h-10 !rounded-full !px-0 !py-0 leading-none shrink-0'
                onClick={inc}
              >
                <Icon
                  name='material-symbols:add-rounded'
                  size={22}
                  className='text-white'
                />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
