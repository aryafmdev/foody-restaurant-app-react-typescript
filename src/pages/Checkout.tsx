import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/container';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { DeliveryAddressCard, PaymentMethodCard } from '../components';
import {
  useCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} from '../services/queries/cart';
import { useCheckoutMutation } from '../services/queries/orders';
import { putOrderHistory } from '../services/queries/orders';
import { useProfileQuery } from '../services/queries/auth';
import type { GetCartResponse } from '../types/schemas';
import { MyCheckoutCard } from '../components';
import type { Transaction } from '../types/schemas';

export default function Checkout() {
  const token = useSelector((s: RootState) => s.auth.token);
  const userId = useSelector((s: RootState) => s.auth.userId);
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCartQuery(userId, isLoggedIn);
  const updateQty = useUpdateCartItemMutation(userId ?? 'guest');
  const removeItem = useDeleteCartItemMutation(userId ?? 'guest');
  const clearCart = useClearCartMutation(userId ?? 'guest');
  const checkout = useCheckoutMutation();
  const { data: profile } = useProfileQuery(isLoggedIn);

  const [payment, setPayment] = useState<'bni' | 'bri' | 'bca' | 'mandiri'>(
    'bni'
  );

  if (!isLoggedIn)
    return (
      <Container className='py-2xl'>
        <Alert variant='warning'>Silakan login untuk checkout</Alert>
        <Button className='mt-md' onClick={() => navigate('/login')}>
          Login
        </Button>
      </Container>
    );

  if (isLoading)
    return (
      <Container className='py-2xl'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='mt-xs h-4 w-56' />
        <div className='mt-2xl space-y-2xl'>
          {[0, 1].map((i) => (
            <div
              key={i}
              className='rounded-lg border border-neutral-200 p-2xl shadow-md'
            >
              <div className='inline-flex items-center gap-sm'>
                <Skeleton className='h-6 w-6 rounded' />
                <Skeleton className='h-5 w-32' />
              </div>
              <div className='mt-xl space-y-xl'>
                {[0, 1].map((j) => (
                  <div key={j} className='flex items-center justify-between'>
                    <div className='flex items-center gap-md'>
                      <Skeleton className='h-16 w-16 rounded-lg' />
                      <div className='space-y-xxs'>
                        <Skeleton className='h-4 w-40' />
                        <Skeleton className='h-5 w-24' />
                      </div>
                    </div>
                    <div className='inline-flex items-center gap-md'>
                      <Skeleton className='h-10 w-10 rounded-full' />
                      <Skeleton className='h-5 w-6' />
                      <Skeleton className='h-10 w-10 rounded-full' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    );

  if (isError)
    return (
      <Container className='py-2xl'>
        <Alert variant='error'>Gagal memuat data</Alert>
      </Container>
    );

  const groups = (data?.data?.cart ?? []) as GetCartResponse['data']['cart'];
  const summary = data?.data?.summary;
  const subtotal = summary?.totalPrice ?? 0;
  const deliveryFee = 10000;
  const serviceFee = 1000;
  const grandTotal = subtotal + deliveryFee + serviceFee;

  return (
    <Container className='mb-6xl'>
      <div className='text-display-sm font-extrabold text-neutral-950'>
        Checkout
      </div>

      <div className='mt-2xl space-y-xl'>
        <DeliveryAddressCard
          className='mt-xs'
          address={'Jl. Sudirman No. 10, Jakarta'}
          phone={profile?.data?.phone ?? '08xx-xxxx-xxxx'}
          changeLabel='Change'
          onChange={() => navigate('/profile')}
        />

        <div>
          {groups.map((g) => {
            const byIndexId = g.items.map((it) => it.id);
            return (
              <MyCheckoutCard
                storeName={g.restaurant.name}
                onClickStore={() => navigate(`/restaurant/${g.restaurant.id}`)}
                onAddItem={() => navigate(`/restaurant/${g.restaurant.id}`)}
                items={g.items.map((it) => ({
                  title: it.menu.foodName,
                  price: it.menu.price,
                  imageUrl: it.menu.image,
                  quantity: it.quantity,
                }))}
                onChangeItemQty={(index, q) => {
                  const id = byIndexId[index];
                  if (q <= 0) removeItem.mutate({ id });
                  else updateQty.mutate({ id, quantity: q });
                }}
                className='mb-2xl'
              />
            );
          })}
        </div>

        <PaymentMethodCard
          selected={payment}
          onChange={setPayment}
          itemsCount={summary?.totalItems ?? 0}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          serviceFee={serviceFee}
          total={grandTotal}
          buying={checkout.isPending}
          buyingLabel='Buying...'
          onBuy={() =>
            checkout.mutate(
              { paymentMethod: payment },
              {
                onSuccess: (res) => {
                  const tx = res?.data?.transaction;
                  const restaurantsOptimistic = groups.map((g) => ({
                    restaurant: {
                      id: g.restaurant.id,
                      name: g.restaurant.name,
                      logo: g.restaurant.logo,
                    },
                    items: g.items.map((it) => ({
                      menuId: it.menu.id,
                      menuName: it.menu.foodName,
                      price: it.menu.price,
                      quantity: it.quantity,
                      itemTotal: it.itemTotal,
                    })),
                    subtotal: g.subtotal,
                  }));
                  const optimisticTx: Transaction = {
                    id: tx?.id,
                    transactionId: tx?.transactionId ?? `TRX-${Date.now()}`,
                    paymentMethod: tx?.paymentMethod ?? payment,
                    status: tx?.status ?? 'preparing',
                    restaurants: restaurantsOptimistic,
                    pricing: {
                      subtotal,
                      serviceFee,
                      deliveryFee,
                      totalPrice: grandTotal,
                    },
                    createdAt: tx?.createdAt ?? new Date().toISOString(),
                  };
                  putOrderHistory(userId ?? 'guest', optimisticTx);
                  clearCart.mutate();
                  navigate('/success', {
                    state: {
                      transaction: optimisticTx,
                      paymentMethod: tx?.paymentMethod ?? payment,
                      createdAt: tx?.createdAt ?? new Date().toISOString(),
                      itemsCount: summary?.totalItems ?? 0,
                      subtotal,
                      deliveryFee,
                      serviceFee,
                      total: grandTotal,
                    },
                  });
                },
              }
            )
          }
        />
      </div>
    </Container>
  );
}
