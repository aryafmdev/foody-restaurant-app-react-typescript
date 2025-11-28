import { Container } from '../ui/container';
import { Button } from '../ui/button';
import { Skeleton } from '../ui';
import {
  useCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} from '../services/queries/cart';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import MyCartCard from '../components/MyCartCard';
import { useCheckoutMutation } from '../services/queries/orders';
import { Alert } from '../ui/alert';
import { useNavigate } from 'react-router-dom';
import type { GetCartResponse } from '../types/schemas';

export default function Cart() {
  const token = useSelector((s: RootState) => s.auth.token);
  const userId = useSelector((s: RootState) => s.auth.userId);
  const isLoggedIn = !!token;
  const { data, isLoading, isError } = useCartQuery(userId, isLoggedIn);
  const updateQty = useUpdateCartItemMutation(userId ?? 'guest');
  const removeItem = useDeleteCartItemMutation(userId ?? 'guest');
  const clearAll = useClearCartMutation(userId ?? 'guest');
  const checkout = useCheckoutMutation();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <Container className='py-2xl'>
        <Alert variant='warning'>Please sign in to view your cart</Alert>
      </Container>
    );
  }
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
              <div className='mt-2xl border-t border-neutral-300 border-dashed' />
              <div className='flex justify-between items-center mt-xl'>
                <div className='space-y-xxs'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-5 w-24' />
                </div>
                <Skeleton className='h-11 w-40 rounded-full' />
              </div>
            </div>
          ))}
        </div>
      </Container>
    );
  if (isError)
    return (
      <Container className='py-2xl'>
        <Alert variant='error'>Failed to load cart</Alert>
      </Container>
    );

  const groups = (data?.data?.cart ?? []) as GetCartResponse['data']['cart'];
  const summary = data?.data?.summary;

  return (
    <Container className='py-2xl'>
      <div className='flex items-start justify-between'>
        <div>
          <div className='text-display-xs font-extrabold text-neutral-950'>
            My Cart
          </div>
          <div className='mt-xs text-sm text-neutral-700'>
            {summary
              ? `${summary.totalItems} items • Rp${(
                  summary.totalPrice ?? 0
                ).toLocaleString('id-ID')}`
              : ''}
          </div>
        </div>
        <div>
          <Button
            variant='danger'
            size='sm'
            className='rounded-full px-xl bg-primary/20 hover:bg-primary-100'
            onClick={() => clearAll.mutate()}
            disabled={!summary || (summary.totalItems ?? 0) <= 0}
          >
            Clear All
          </Button>
        </div>
      </div>
      <div className='mt-2xl space-y-2xl'>
        {groups.map((g) => {
          const items = g.items.map((it) => ({
            title: it.menu.foodName,
            price: it.menu.price,
            imageUrl: it.menu.image,
            quantity: it.quantity,
          }));
          const byIndexId = g.items.map((it) => it.id);
          return (
            <MyCartCard
              key={`group-${g.restaurant.id}`}
              storeName={g.restaurant.name}
              onClickStore={() => navigate(`/restaurant/${g.restaurant.id}`)}
              onClearStore={() => {
                const ids = byIndexId;
                for (const id of ids) removeItem.mutate({ id });
              }}
              clearDisabled={g.items.length <= 0}
              items={items}
              onChangeItemQty={(index, qty) => {
                const id = byIndexId[index];
                if (qty <= 0) removeItem.mutate({ id });
                else updateQty.mutate({ id, quantity: qty });
              }}
              onCheckout={() =>
                checkout.mutate(
                  {},
                  {
                    onSuccess: () => navigate('/orders'),
                  }
                )
              }
            />
          );
        })}
      </div>
    </Container>
  );
}
