import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../ui/container';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent } from '../ui/dialog';
import { GiveReviewCard } from '../components';
import { Skeleton } from '../ui/skeleton';
import { Alert } from '../ui/alert';
import SegmentedControl from '../components/SegmentedControl';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { SidebarProfile } from '../components';
import { Icon } from '../ui/icon';
import { IconButton } from '../ui/icon-button';
import { useMyOrdersQuery } from '../services/queries/orders';
import { useCreateReviewMutation } from '../services/queries/reviews';
import { getOrderHistory } from '../services/queries/orders';

import type {
  Transaction,
  TransactionRestaurant,
  TransactionRestaurantItem,
  TransactionPricing,
} from '../types/schemas';
import MyOrderCard from '../components/MyOrderCard';

export default function MyOrders() {
  const navigate = useNavigate();
  const loc = useLocation();
  const token = useSelector((s: RootState) => s.auth.token);
  const userId = useSelector((s: RootState) => s.auth.userId);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!isLoggedIn) navigate('/login?tab=signin');
  }, [isLoggedIn, navigate]);

  const [status, setStatus] = useState<
    'all' | 'preparing' | 'on_the_way' | 'delivered' | 'done' | 'cancelled'
  >('all');
  const [search, setSearch] = useState('');
  const params = useMemo(
    () => (status === 'all' ? undefined : { status }),
    [status]
  );
  const { data, isLoading, isError } = useMyOrdersQuery(params);
  const createReview = useCreateReviewMutation();

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    transactionId: string;
    restaurantId: number;
  } | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const openReview = (transactionId?: string, restaurantId?: number) => {
    if (!transactionId || restaurantId == null) return;
    setReviewTarget({ transactionId, restaurantId });
    setRating(0);
    setComment('');
    setReviewOpen(true);
  };
  const sendReview = () => {
    if (!reviewTarget) return;
    if (rating <= 0) return;
    createReview.mutate(
      {
        transactionId: reviewTarget.transactionId,
        restaurantId: reviewTarget.restaurantId,
        star: rating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          setReviewOpen(false);
        },
      }
    );
  };

  type MyOrder = {
    id?: number;
    transactionId?: string;
    status?: Transaction['status'] | string;
    createdAt?: string;
    restaurants?: TransactionRestaurant[];
    pricing?: TransactionPricing;
  };
  const orders = (data?.data?.orders ?? []) as unknown as MyOrder[];
  const tx = (loc.state as unknown as { transaction?: Transaction })
    ?.transaction;
  const optimisticRestaurants = Array.isArray(tx?.restaurants)
    ? (tx!.restaurants as TransactionRestaurant[])
    : [];
  const serverTx = tx?.transactionId
    ? orders.find((o) => o?.transactionId === tx.transactionId)
    : undefined;
  const norm = (rs: TransactionRestaurant[] | undefined) => {
    const arr = Array.isArray(rs) ? rs : [];
    return arr
      .map((r) => ({
        id: r?.restaurant?.id,
        name: r?.restaurant?.name,
        items: (Array.isArray(r?.items) ? r.items : []).map((it) => ({
          name: (it as TransactionRestaurantItem)?.menuName,
          price: (it as TransactionRestaurantItem)?.price,
          qty: (it as TransactionRestaurantItem)?.quantity,
        })),
      }))
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      .map((r) => ({
        ...r,
        items: r.items
          .slice()
          .sort((a, b) =>
            `${String(a.name)}-${a.price}`.localeCompare(
              `${String(b.name)}-${b.price}`
            )
          ),
      }));
  };
  const isServerConsistent =
    tx && serverTx
      ? JSON.stringify(norm(serverTx.restaurants)) ===
        JSON.stringify(norm(tx.restaurants))
      : false;
  const localTxs = getOrderHistory(userId ?? 'guest');
  const localOrders: MyOrder[] = (localTxs ?? []).map((ltx) => ({
    transactionId: ltx.transactionId,
    status: ltx.status,
    createdAt: ltx.createdAt,
    restaurants: (ltx.restaurants ?? []) as TransactionRestaurant[],
    pricing: ltx.pricing,
  }));
  const serverMap = new Map<string, MyOrder>();
  for (const o of orders) {
    const id = o?.transactionId ?? '';
    if (id) serverMap.set(id, o);
  }
  const inconsistentIds = new Set<string>();
  for (const lo of localOrders) {
    const id = lo.transactionId ?? '';
    if (!id) continue;
    const so = serverMap.get(id);
    if (so) {
      const same =
        JSON.stringify(norm(so.restaurants)) ===
        JSON.stringify(norm(lo.restaurants));
      if (!same) inconsistentIds.add(id);
    }
  }
  if (tx?.transactionId && !isServerConsistent)
    inconsistentIds.add(tx.transactionId);
  const filteredServerOrders = orders.filter(
    (o) => !inconsistentIds.has(String(o?.transactionId ?? ''))
  );
  const localFallbackOrders = localOrders.filter((lo) => {
    const id = lo.transactionId ?? '';
    if (!id) return false;
    if (tx?.transactionId && id === tx.transactionId) return false;
    const so = serverMap.get(id);
    if (!so) return true;
    const same =
      JSON.stringify(norm(so.restaurants)) ===
      JSON.stringify(norm(lo.restaurants));
    return !same;
  });
  const filteredOrders = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const rs = Array.isArray(o?.restaurants) ? o.restaurants! : [];
    const items = rs.flatMap((r) =>
      Array.isArray(r?.items) ? (r.items as TransactionRestaurantItem[]) : []
    );
    return items.some((it) =>
      String(it?.menuName ?? '')
        .toLowerCase()
        .includes(q)
    );
  });
  void filteredOrders;
  const filteredServerOrdersByStatus =
    status === 'all'
      ? filteredServerOrders
      : filteredServerOrders.filter((o) => String(o?.status ?? '') === status);
  const filteredLocalFallback = localFallbackOrders.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const rs = Array.isArray(o?.restaurants) ? o.restaurants! : [];
    const items = rs.flatMap((r) =>
      Array.isArray(r?.items) ? (r.items as TransactionRestaurantItem[]) : []
    );
    return items.some((it) =>
      String(it?.menuName ?? '')
        .toLowerCase()
        .includes(q)
    );
  });
  const filteredLocalFallbackByStatus =
    status === 'all'
      ? filteredLocalFallback
      : filteredLocalFallback.filter((o) => String(o?.status ?? '') === status);
  const tsOf = (o: MyOrder) => {
    const d = Date.parse(String(o?.createdAt ?? ''));
    if (isFinite(d)) return d;
    const id = String(o?.transactionId ?? '');
    const num = Number(id.replace(/\D/g, ''));
    return isFinite(num) ? num : 0;
  };
  const sortedServerOrders = filteredServerOrdersByStatus
    .slice()
    .sort((a, b) => tsOf(b) - tsOf(a));
  const sortedLocalFallback = filteredLocalFallbackByStatus
    .slice()
    .sort((a, b) => tsOf(b) - tsOf(a));
  const showOptimistic =
    optimisticRestaurants.length > 0 &&
    !isServerConsistent &&
    (status === 'all' || status === 'preparing');
  const hasAnyOrders =
    sortedServerOrders.length > 0 ||
    sortedLocalFallback.length > 0 ||
    showOptimistic;

  return (
    <>
      <Container className='py-3xl max-w-[1200px]'>
        <div className='md:grid md:grid-cols-[240px_1fr] gap-3xl items-start'>
          <div className='hidden md:block md:w-[240px]'>
            <SidebarProfile
              name={authUser?.name ?? 'User'}
              avatar={authUser?.avatar ?? undefined}
              onProfile={() => navigate('/profile')}
              onDeliveryAddress={() => navigate('/address')}
              onMyOrders={() => navigate('/orders')}
              onMyReviews={() => navigate('/my-reviews')}
              onLogout={() => navigate('/login')}
              insideDialog={false}
              className='w-full md:w-[240px]'
              activeItem='my_orders'
            />
          </div>

          <div className='md:col-span-1'>
            <div className='text-display-md font-extrabold text-neutral-950'>
              My Orders
            </div>

            <div className='mt-5xl'>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder='Search'
              />
            </div>

            <div className='mt-4xl'>
              <SegmentedControl
                options={[
                  { label: 'Status', value: 'all' },
                  { label: 'Preparing', value: 'preparing' },
                  { label: 'On The Way', value: 'on_the_way' },
                  { label: 'Delivered', value: 'delivered' },
                  { label: 'Done', value: 'done' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                value={status}
                onChange={(v) => setStatus(v as typeof status)}
                className='w-full md:w-auto'
                scrollable
              />
            </div>

            {isLoading ? (
              <div className='mt-2xl space-y-2xl'>
                {[0, 1].map((i) => (
                  <Card
                    key={i}
                    className='rounded-lg shadow-md border-none bg-white'
                  >
                    <CardContent className='p-2xl space-y-2xl'>
                      <div className='inline-flex items-center gap-sm'>
                        <Skeleton className='h-6 w-6 rounded' />
                        <Skeleton className='h-5 w-32' />
                      </div>
                      <div className='flex items-center gap-md'>
                        <Skeleton className='h-16 w-16 rounded-lg' />
                        <div className='space-y-xxs'>
                          <Skeleton className='h-4 w-40' />
                          <Skeleton className='h-5 w-24' />
                        </div>
                      </div>
                      <div className='border-t border-neutral-300' />
                      <Skeleton className='h-4 w-16' />
                      <Skeleton className='h-5 w-24' />
                      <Skeleton className='h-11 w-40 rounded-full' />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              <div className='mt-2xl'>
                <Alert variant='error'>Gagal memuat orders</Alert>
              </div>
            ) : !hasAnyOrders ? (
              <EmptyState
                title='Belum ada pesanan'
                description='Mulai pesan dari restoran favorit kamu'
                actionLabel='Lihat Restoran'
                onAction={() => navigate('/restaurants')}
                className='mt-3xl'
              />
            ) : (
              <div className='mt-2xl space-y-2xl'>
                {showOptimistic && (
                  <div className='space-y-2xl'>
                    {optimisticRestaurants.map((r, i) => {
                      const name = r?.restaurant?.name ?? 'Store';
                      const rid = r?.restaurant?.id;
                      const items = Array.isArray(r?.items)
                        ? (r.items as TransactionRestaurantItem[])
                        : [];
                      const orderItems = items.map((it) => ({
                        title: it?.menuName ?? 'Food Name',
                        unitPrice: it?.price ?? 0,
                        imageUrl: undefined,
                        quantity: it?.quantity ?? 0,
                      }));
                      return (
                        <MyOrderCard
                          key={`optimistic-${String(
                            tx?.transactionId ?? ''
                          )}-${i}`}
                          storeName={name}
                          items={orderItems}
                          orderId={tx?.transactionId ?? undefined}
                          status={'preparing'}
                          onGiveReview={() =>
                            openReview(tx?.transactionId, rid)
                          }
                        />
                      );
                    })}
                  </div>
                )}
                {sortedLocalFallback.map((o, idx) => {
                  const txId = o?.transactionId ?? '';
                  const restaurants = Array.isArray(o?.restaurants)
                    ? (o.restaurants as unknown as TransactionRestaurant[])
                    : [];
                  return (
                    <div key={`local-${txId || idx}`} className='space-y-2xl'>
                      {restaurants.map((r, i) => {
                        const name = r?.restaurant?.name ?? 'Store';
                        const rid = r?.restaurant?.id;
                        const items = Array.isArray(r?.items)
                          ? (r.items as unknown as TransactionRestaurantItem[])
                          : [];
                        const orderItems = items.map((it) => ({
                          title: it?.menuName ?? 'Food Name',
                          unitPrice: it?.price ?? 0,
                          imageUrl: undefined,
                          quantity: it?.quantity ?? 0,
                        }));
                        return (
                          <MyOrderCard
                            key={`local-${txId}-${i}`}
                            storeName={name}
                            items={orderItems}
                            orderId={o?.transactionId}
                            status={String(o?.status ?? '')}
                            onGiveReview={() =>
                              openReview(o?.transactionId, rid)
                            }
                          />
                        );
                      })}
                    </div>
                  );
                })}
                {sortedServerOrders.map((o, idx) => {
                  const txId = o?.transactionId ?? '';
                  const restaurants = Array.isArray(o?.restaurants)
                    ? (o.restaurants as unknown as TransactionRestaurant[])
                    : [];
                  return (
                    <div key={txId || idx} className='space-y-2xl'>
                      {restaurants.map((r, i) => {
                        const name = r?.restaurant?.name ?? 'Store';
                        const rid = r?.restaurant?.id;
                        const items = Array.isArray(r?.items)
                          ? (r.items as unknown as TransactionRestaurantItem[])
                          : [];
                        const orderItems = items.map((it) => ({
                          title: it?.menuName ?? 'Food Name',
                          unitPrice: it?.price ?? 0,
                          imageUrl: (it as { image?: string })?.image,
                          quantity: it?.quantity ?? 0,
                        }));
                        return (
                          <MyOrderCard
                            key={`${txId}-${i}`}
                            storeName={name}
                            items={orderItems}
                            orderId={o?.transactionId}
                            status={String(o?.status ?? '')}
                            onGiveReview={() =>
                              openReview(o?.transactionId, rid)
                            }
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className='h-16 md:h-20' />
        <IconButton
          aria-label='Update Order Status'
          variant='ghost'
          size='none'
          className='absolute bottom-4 right-4 md:bottom-6 md:right-6 size-10 rounded-full shadow-lg z-10 hover:bg-primary-100'
          onClick={() => navigate('/orders/update-status')}
        >
          <Icon name='ix:app-update' size={24} className='text-white' />
        </IconButton>
      </Container>
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className='rounded-2xl p-xl w-[92%] max-w-[400px] mx-auto'>
          <GiveReviewCard
            rating={rating}
            onRatingChange={setRating}
            comment={comment}
            onCommentChange={(v) => setComment(v)}
            onSubmit={sendReview}
            pending={createReview.isPending}
            disabled={rating <= 0 || !reviewTarget}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
