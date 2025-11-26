import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Icon } from '../ui/icon';
import storeImg from '../assets/images/store.png';
import itemDefaultImg from '../assets/images/image.png';
import CartItemRow from './CartItemRow';
import { Button } from '../ui/button';
import { formatCurrency } from '../lib/format';
import { useState } from 'react';

type CartItem = {
  title: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

type MyCartCardProps = {
  storeName: string;
  items: CartItem[];
  onChangeItemQty?: (index: number, qty: number) => void;
  onCheckout?: () => void;
  className?: string;
};

export default function MyCartCard({
  storeName,
  items,
  onChangeItemQty,
  onCheckout,
  className,
}: MyCartCardProps) {
  const [list, setList] = useState<CartItem[]>(items);
  const total = list.reduce((sum, it) => sum + it.price * it.quantity, 0);
  return (
    <Card
      className={['rounded-lg shadow-md border border-neutral-200', className]
        .filter(Boolean)
        .join(' ')}
    >
      <CardHeader className='p-2xl pb-xl border-none'>
        <div className='inline-flex items-center gap-sm'>
          <img src={storeImg} alt='Store' className='h-6 w-6' />
          <span className='text-md md:text-lg font-bold text-neutral-950'>
            {storeName}
          </span>
          <Icon
            name='line-md:chevron-right'
            size={22}
            className='text-neutral-700'
          />
        </div>
      </CardHeader>
      <CardContent className='p-2xl'>
        <div className='space-y-2xl'>
          {list.map((it, i) => (
            <CartItemRow
              key={`${it.title}-${i}`}
              title={it.title}
              price={it.price}
              imageUrl={it.imageUrl ?? itemDefaultImg}
              quantity={it.quantity}
              onQuantityChange={(q) => {
                if (onChangeItemQty) {
                  onChangeItemQty(i, q);
                } else {
                  setList((prev) =>
                    prev.map((x, idx) =>
                      idx === i ? { ...x, quantity: q } : x
                    )
                  );
                }
              }}
              variant='cart'
            />
          ))}
        </div>
        <div className='mt-2xl border-t border-neutral-300 border-dashed' />
      </CardContent>
      <CardFooter className='p-2xl pt-xl border-none'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between w-full'>
          <div>
            <div className='text-sm text-neutral-700'>Total</div>
            <div className='text-md font-extrabold text-neutral-900'>
              {formatCurrency(total, 'IDR')}
            </div>
          </div>
          <Button
            variant='primary'
            size='md'
            className='mt-lg font-bold md:mt-0 w-full md:w-auto'
            onClick={onCheckout}
          >
            Checkout
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
