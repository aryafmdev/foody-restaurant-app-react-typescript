import { useLocation, useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Container } from '../ui/container';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../lib/cn';
import { formatCurrency } from '../lib/format';
import logo from '../assets/images/logo.png';
import { Icon } from '../ui/icon';

type SuccessState = {
  paymentMethod?: string;
  createdAt?: string;
  itemsCount?: number;
  subtotal?: number;
  deliveryFee?: number;
  serviceFee?: number;
  total?: number;
  transaction?: import('../types/schemas').Transaction;
};

const PAYMENT_LABEL: Record<string, string> = {
  bni: 'Bank Negara Indonesia',
  bri: 'Bank Rakyat Indonesia',
  bca: 'Bank Central Asia',
  mandiri: 'Mandiri',
};

export default function Success() {
  const navigate = useNavigate();
  const loc = useLocation();
  const state = (loc.state ?? {}) as SuccessState;
  const tx = state.transaction;
  const itemsCount = state.itemsCount ?? 0;
  const subtotal = state.subtotal ?? 0;
  const deliveryFee = state.deliveryFee ?? 0;
  const serviceFee = state.serviceFee ?? 0;
  const total = state.total ?? subtotal + deliveryFee + serviceFee;
  const createdAt =
    tx?.createdAt ?? state.createdAt ?? new Date().toISOString();
  const methodKey = String(
    tx?.paymentMethod ?? state.paymentMethod ?? ''
  ).toLowerCase();
  const paymentLabel =
    PAYMENT_LABEL[methodKey] ?? tx?.paymentMethod ?? state.paymentMethod ?? '—';

  const formattedDate = dayjs(createdAt)
    .locale('id')
    .format('D MMMM YYYY, HH:mm');

  return (
    <Container className='h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center'>
        <div className='inline-flex items-center gap-sm'>
          <span
            aria-label='Foody logo'
            className='inline-block h-8 w-8 bg-primary'
            style={
              {
                WebkitMaskImage: `url(${logo})`,
                maskImage: `url(${logo})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              } as CSSProperties
            }
          />
          <span className='font-extrabold text-display-md text-neutral-950'>
            Foody
          </span>
        </div>

        <Card
          className={cn(
            'mt-2xl rounded-lg border-none w-full md:w-[480px] bg-white'
          )}
        >
          <CardContent className='p-xl space-y-2xl'>
            <div className='flex flex-col items-center text-center space-y-xl'>
              <div className='inline-flex items-center justify-center size-12 rounded-full bg-[#44ab09]'>
                <Icon
                  name='mingcute:check-fill'
                  size={28}
                  className='text-white'
                />
              </div>
              <div className='text-md font-extrabold text-neutral-950'>
                Payment Success
              </div>
              <div className='text-sm text-neutral-950'>
                Your payment has been successfully processed.
              </div>
            </div>

            <div className='relative my-lg'>
              <div className='absolute -left-4 top-1/2 -translate-y-1/2 size-4 rounded-full bg-neutral-100' />
              <div className='absolute -right-4 top-1/2 -translate-y-1/2 size-4 rounded-full bg-neutral-100' />
              <div className='border-t border-neutral-300 border-dashed' />
            </div>

            <div className='space-y-4xl'>
              <div className='space-y-4xl'>
                <div className='flex items-center justify-between text-sm'>
                  <span>Date</span>
                  <span className='text-sm text-neutral-950 font-medium'>
                    {formattedDate}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span>Payment Method</span>
                  <span className='text-sm text-neutral-950 font-medium'>
                    {paymentLabel}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span>Price ( {itemsCount} items )</span>
                  <span className='text-sm text-neutral-950 font-medium'>
                    {formatCurrency(subtotal, 'IDR')}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span>Delivery Fee</span>
                  <span className='text-sm text-neutral-950 font-medium'>
                    {formatCurrency(deliveryFee, 'IDR')}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span>Service Fee</span>
                  <span className='text-sm text-neutral-950 font-medium'>
                    {formatCurrency(serviceFee, 'IDR')}
                  </span>
                </div>
              </div>

              <div className='relative my-md'>
                <div className='absolute -left-4 top-1/2 -translate-y-1/2 size-4 rounded-full bg-neutral-100' />
                <div className='absolute -right-4 top-1/2 -translate-y-1/2 size-4 rounded-full bg-neutral-100' />
                <div className='border-t border-neutral-300 border-dashed' />
              </div>

              <div className='flex items-center justify-between text-md font-medium'>
                <span>Total</span>
                <span className='text-sm text-neutral-950 font-extrabold'>
                  {formatCurrency(total, 'IDR')}
                </span>
              </div>
            </div>

            <div>
              <Button
                variant='primary'
                size='md'
                className='w-full rounded-full h-12'
                onClick={() =>
                  navigate('/orders', { state: { transaction: tx } })
                }
              >
                See My Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
