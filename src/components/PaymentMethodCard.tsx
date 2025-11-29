import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../lib/cn';
import { formatCurrency } from '../lib/format';
import bniImg from '../assets/images/bni.png';
import briImg from '../assets/images/bri.png';
import bcaImg from '../assets/images/bca.png';
import mandiriImg from '../assets/images/mandiri.png';

type PaymentMethod = 'bni' | 'bri' | 'bca' | 'mandiri';

type PaymentMethodCardProps = {
  title?: string;
  selected: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  itemsCount?: number;
  subtotal?: number;
  deliveryFee?: number;
  serviceFee?: number;
  total?: number;
  buyLabel?: string;
  onBuy?: () => void;
  className?: string;
};

const METHODS: Array<{
  id: PaymentMethod;
  label: string;
  img: string;
  alt: string;
}> = [
  { id: 'bni', label: 'Bank Negara Indonesia', img: bniImg, alt: 'BNI' },
  { id: 'bri', label: 'Bank Rakyat Indonesia', img: briImg, alt: 'BRI' },
  { id: 'bca', label: 'Bank Central Asia', img: bcaImg, alt: 'BCA' },
  { id: 'mandiri', label: 'Mandiri', img: mandiriImg, alt: 'Mandiri' },
];

export default function PaymentMethodCard({
  title = 'Payment Method',
  selected,
  onChange,
  itemsCount = 0,
  subtotal = 0,
  deliveryFee = 0,
  serviceFee = 0,
  total = subtotal + deliveryFee + serviceFee,
  buyLabel = 'Buy',
  onBuy,
  className,
}: PaymentMethodCardProps) {
  return (
    <Card
      className={cn('rounded-lg border-none bg-white', className)}
    >
      <CardContent className='p-2xl space-y-lg'>
        <div className='text-md font-bold text-neutral-950'>{title}</div>
        <div className='space-y-sm'>
          {METHODS.map((m) => (
            <label
              key={m.id}
              className='inline-flex items-center justify-between w-full py-sm'
            >
              <div className='inline-flex items-center gap-sm'>
                <img src={m.img} alt={m.alt} className='size-10' />
                <span className='text-sm text-neutral-950'>{m.label}</span>
              </div>
              <input
                type='radio'
                name='payment'
                checked={selected === m.id}
                onChange={() => onChange(m.id)}
                className='peer sr-only'
              />
              <span className='inline-block size-6 rounded-full border border-neutral-300 bg-white relative peer-checked:border-primary-100 peer-checked:bg-primary-100 after:hidden peer-checked:after:block after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:size-2.5 after:bg-white after:rounded-full' />
            </label>
          ))}
        </div>

        <div className='relative my-md'>
          <div className='absolute -left-4 top-1/2 -translate-y-1/2 size-4 rounded-full bg-neutral-100' />
          <div className='absolute -right-4 top-1/2 -translate-y-1/2 size-4 rounded-full bg-neutral-100' />
          <div className='border-t border-neutral-300 border-dashed' />
        </div>

        <div className='space-y-2xl'>
          <div className='text-md font-extrabold text-neutral-950'>
            Payment Summary
          </div>
          <div className='space-y-2xl'>
            <div className='flex font-medium items-center justify-between text-sm'>
              <span>Price ({itemsCount} items)</span>
              <span className='text-sm text-neutral-950 font-extrabold'>
                {formatCurrency(subtotal, 'IDR')}
              </span>
            </div>
            <div className='flex font-medium items-center justify-between text-sm'>
              <span>Delivery Fee</span>
              <span className='text-sm text-neutral-950 font-extrabold'>
                {formatCurrency(deliveryFee, 'IDR')}
              </span>
            </div>
            <div className='flex font-medium items-center justify-between text-sm'>
              <span>Service Fee</span>
              <span className='text-sm text-neutral-950 font-extrabold'>
                {formatCurrency(serviceFee, 'IDR')}
              </span>
            </div>
            <div className='flex font-medium items-center justify-between text-md font-medium'>
              <span>Total</span>
              <span className='text-sm text-neutral-950 font-extrabold'>
                {formatCurrency(total, 'IDR')}
              </span>
            </div>
          </div>
        </div>

        {onBuy ? (
          <div>
            <Button
              variant='primary'
              size='md'
              className='w-full rounded-full h-12'
              onClick={onBuy}
            >
              {buyLabel}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
