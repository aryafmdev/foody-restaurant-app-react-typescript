import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { formatCurrency } from '../lib/format';
import fallbackImg from '../assets/images/fallback-image.png';
import { useEffect, useState } from 'react';
import { Image } from '../ui/image';

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
  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);
  const img = imageUrl ?? fallbackImg;
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
    <Card className='overflow-hidden rounded-lg shadow-md md:shadow-lg border-none h-[306px] md:w-auto md:h-[379px] grid grid-rows-2 md:grid-rows-[3fr_1fr]'>
      <CardHeader className='p-none h-full'>
        <Image
          src={img}
          alt={title}
          fallbackSrc={fallbackImg}
          className='h-full w-full rounded-none object-cover'
        />
      </CardHeader>
      <CardContent className='p-lg md:p-2xl h-full flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col gap-md'>
          <div>
            <div className='mt-xl text-sm font-medium md:text-md text-neutral-950 line-clamp-1'>
              {title}
            </div>
            <div className='mt-xl text-md md:text-lg font-extrabold text-neutral-900'>
              {formatCurrency(price, 'IDR')}
            </div>
          </div>
        </div>
        {qty === 0 ? (
          <Button
            variant='primary'
            size='sm'
            className='w-full md:w-[79px] md:h-[40px] md:text-md md:mt-0 mt-auto'
            onClick={add}
          >
            Add
          </Button>
        ) : (
          <div className='mt-auto md:mt-0 inline-flex items-center gap-md w-full md:w-auto md:ml-auto'>
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
      </CardContent>
    </Card>
  );
}
