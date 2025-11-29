import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/container';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Alert } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import MyOrderCard from '../components/MyOrderCard';
import {
  useMyOrdersQuery,
  useUpdateOrderStatusMutation,
  getOrderHistory,
  putOrderHistory,
} from '../services/queries/orders';
import type {
  Transaction,
  TransactionRestaurant,
  TransactionRestaurantItem,
  TransactionPricing,
  UpdateOrderStatusResponse,
} from '../types/schemas';

export default function UpdateOrderStatus() {
  const navigate = useNavigate();
  const token = useSelector((s: RootState) => s.auth.token);
  const isLoggedIn = !!token;
  useEffect(() => {
    if (!isLoggedIn)
      navigate('/login?tab=signin&redirect=/orders/update-status');
  }, [isLoggedIn, navigate]);

  const { data, isLoading, isError } = useMyOrdersQuery();
  const upd = useUpdateOrderStatusMutation();
  const [pendingId, setPendingId] = useState<string | number | null>(null);
  const [localDisabled, setLocalDisabled] = useState<Record<string, boolean>>(
    {}
  );
  const userId = useSelector((s: RootState) => s.auth.userId);
  const [localTick, setLocalTick] = useState(0);
  const [statusOverride, setStatusOverride] = useState<
    Record<string, Transaction['status']>
  >({});
  const [pendingAction, setPendingAction] = useState<
    'on_the_way' | 'delivered' | 'done' | 'cancelled' | null
  >(null);

  const updateLocalStatus = (txId: string, next: Transaction['status']) => {
    try {
      const arr = getOrderHistory(userId ?? 'guest');
      const idx = arr.findIndex((t) => t.transactionId === txId);
      if (idx < 0) return;
      const prev = arr[idx];
      const merged: Transaction = {
        ...prev,
        transactionId: prev.transactionId ?? txId,
        status: next,
      };
      putOrderHistory(userId ?? 'guest', merged);
      setLocalTick((t) => t + 1);
    } catch {
      void 0;
    }
  };

  type MyOrder = {
    id?: number | string;
    transactionId?: string;
    status?: Transaction['status'] | string;
    createdAt?: string;
    restaurants?: TransactionRestaurant[];
    pricing?: TransactionPricing;
  };
  const orders = useMemo(
    () => (data?.data?.orders ?? []) as unknown as MyOrder[],
    [data]
  );
  const norm = (rs: TransactionRestaurant[] | undefined) => {
    const arr = Array.isArray(rs) ? rs : [];
    return arr
      .map((r) => ({
        id: r?.restaurant?.id,
        name: r?.restaurant?.name,
        items: (Array.isArray(r?.items) ? r.items : []).map((it) => ({
          title: (it as TransactionRestaurantItem)?.menuName,
          unitPrice: (it as TransactionRestaurantItem)?.price,
          imageUrl: undefined,
          quantity: (it as TransactionRestaurantItem)?.quantity,
        })),
      }))
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  };

  const actionable = useMemo(() => {
    void localTick;
    const serverOrders = orders;
    const localTxs = getOrderHistory(userId ?? 'guest');
    const localOrders: MyOrder[] = (localTxs ?? []).map((ltx) => ({
      transactionId: ltx.transactionId,
      status: ltx.status,
      createdAt: ltx.createdAt,
      restaurants: (ltx.restaurants ?? []) as TransactionRestaurant[],
      pricing: ltx.pricing,
    }));
    const serverMap = new Map<string, MyOrder>();
    for (const o of serverOrders) {
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
    const filteredServerOrders = serverOrders.filter(
      (o) => !inconsistentIds.has(String(o?.transactionId ?? ''))
    );
    const localFallbackOrders = localOrders.filter((lo) => {
      const id = lo.transactionId ?? '';
      if (!id) return false;
      const so = serverMap.get(id);
      if (!so) return true;
      const same =
        JSON.stringify(norm(so.restaurants)) ===
        JSON.stringify(norm(lo.restaurants));
      return !same;
    });
    const isActionable = (s?: string) =>
      ['preparing', 'on_the_way', 'delivered'].includes(
        String(s ?? '').toLowerCase()
      );
    const actServer = filteredServerOrders.filter((o) =>
      isActionable(o.status)
    );
    const actLocal = localFallbackOrders.filter((o) => isActionable(o.status));
    const tsOf = (o: MyOrder) => {
      const d = Date.parse(String(o?.createdAt ?? ''));
      if (isFinite(d)) return d;
      const id = String(o?.transactionId ?? '');
      const num = Number(id.replace(/\D/g, ''));
      return isFinite(num) ? num : 0;
    };
    return [...actLocal, ...actServer].sort((a, b) => tsOf(b) - tsOf(a));
  }, [orders, userId, localTick]);

  return (
    <Container className='py-3xl'>
      <div className='text-display-md font-extrabold text-neutral-950'>
        Update Order Status
      </div>

      {isLoading ? (
        <div className='mt-3xl grid grid-cols-1 gap-2xl'>
          {[0, 1, 2].map((i) => (
            <Card
              key={i}
              className='rounded-lg border-neutral-200 md:shadow-lg'
            >
              <CardContent className='p-2xl space-y-md'>
                <Skeleton className='h-6 w-40' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-full' />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className='mt-2xl'>
          <Alert variant='error'>Failed to load orders</Alert>
        </div>
      ) : actionable.length === 0 ? (
        <div className='mt-3xl'>
          <Alert variant='info'>No orders to update</Alert>
        </div>
      ) : (
        <div className='mt-xl grid grid-cols-1 gap-2xl'>
          {actionable.map((o, idx) => {
            const groups = norm(o.restaurants);
            return (
              <div key={o.transactionId || idx} className='space-y-md'>
                {groups.map((g, i) => (
                  <MyOrderCard
                    key={`${o.transactionId}-${i}`}
                    storeName={g.name ?? 'Restaurant'}
                    items={g.items}
                    orderId={o.transactionId}
                    status={String(o.status ?? '')}
                  />
                ))}
                {(() => {
                  const key = o.id ?? o.transactionId ?? '';
                  const s = String(
                    statusOverride[String(key)] ?? o.status ?? ''
                  ).toLowerCase();
                  const isThisPending = upd.isPending && pendingId === key;
                  const isLocallyDisabled = !!localDisabled[String(key)];
                  const canOnTheWay =
                    s === 'preparing' && !isThisPending && !isLocallyDisabled;
                  const canDelivered =
                    s === 'on_the_way' && !isThisPending && !isLocallyDisabled;
                  const canDone =
                    s === 'delivered' && !isThisPending && !isLocallyDisabled;
                  const canCancel =
                    s === 'preparing' && !isThisPending && !isLocallyDisabled;
                  return (
                    <div className='inline-flex items-center gap-sm'>
                      <Button
                        variant='primary'
                        size='sm'
                        className='rounded-full inline-flex items-center gap-xs'
                        onClick={() => {
                          const id = key;
                          setPendingId(id);
                          if (!o.id && o.transactionId) {
                            updateLocalStatus(
                              String(o.transactionId),
                              'on_the_way'
                            );
                          }
                          setStatusOverride((prev) => ({
                            ...prev,
                            [String(key)]: 'on_the_way',
                          }));
                          setPendingAction('on_the_way');
                          upd.mutate(
                            { id, status: 'on_the_way' },
                            {
                              onSuccess: (res: UpdateOrderStatusResponse) => {
                                const txid = res?.data?.order?.transactionId;
                                const st = String(
                                  res?.data?.order?.status
                                ) as Transaction['status'];
                                if (txid && st)
                                  updateLocalStatus(String(txid), st);
                              },
                              onError: () => {
                                setStatusOverride((prev) => {
                                  const n = { ...prev };
                                  delete n[String(key)];
                                  return n;
                                });
                              },
                              onSettled: () => {
                                setPendingId(null);
                                setPendingAction(null);
                              },
                            }
                          );
                        }}
                        disabled={!canOnTheWay}
                      >
                        {isThisPending && pendingAction === 'on_the_way' ? (
                          <>
                            <Spinner size={16} />
                            <span>Mark On The Way</span>
                          </>
                        ) : (
                          'Mark On The Way'
                        )}
                      </Button>
                      <Button
                        variant='primary'
                        size='sm'
                        className='rounded-full inline-flex items-center gap-xs'
                        onClick={() => {
                          const id = key;
                          setPendingId(id);
                          if (!o.id && o.transactionId) {
                            updateLocalStatus(
                              String(o.transactionId),
                              'delivered'
                            );
                          }
                          setStatusOverride((prev) => ({
                            ...prev,
                            [String(key)]: 'delivered',
                          }));
                          setPendingAction('delivered');
                          upd.mutate(
                            { id, status: 'delivered' },
                            {
                              onSuccess: (res: UpdateOrderStatusResponse) => {
                                const txid = res?.data?.order?.transactionId;
                                const st = String(
                                  res?.data?.order?.status
                                ) as Transaction['status'];
                                if (txid && st)
                                  updateLocalStatus(String(txid), st);
                              },
                              onError: () => {
                                setStatusOverride((prev) => {
                                  const n = { ...prev };
                                  delete n[String(key)];
                                  return n;
                                });
                              },
                              onSettled: () => {
                                setPendingId(null);
                                setPendingAction(null);
                              },
                            }
                          );
                        }}
                        disabled={!canDelivered}
                      >
                        {isThisPending && pendingAction === 'delivered' ? (
                          <>
                            <Spinner size={16} />
                            <span>Mark Delivered</span>
                          </>
                        ) : (
                          'Mark Delivered'
                        )}
                      </Button>
                      <Button
                        variant='primary'
                        size='sm'
                        className='rounded-full inline-flex items-center gap-xs'
                        onClick={() => {
                          const id = key;
                          setPendingId(id);
                          if (!o.id && o.transactionId) {
                            updateLocalStatus(String(o.transactionId), 'done');
                          }
                          setStatusOverride((prev) => ({
                            ...prev,
                            [String(key)]: 'done',
                          }));
                          setPendingAction('done');
                          upd.mutate(
                            { id, status: 'done' },
                            {
                              onSuccess: (res: UpdateOrderStatusResponse) => {
                                const txid = res?.data?.order?.transactionId;
                                const st = String(
                                  res?.data?.order?.status
                                ) as Transaction['status'];
                                if (txid && st)
                                  updateLocalStatus(String(txid), st);
                              },
                              onError: () => {
                                setStatusOverride((prev) => {
                                  const n = { ...prev };
                                  delete n[String(key)];
                                  return n;
                                });
                              },
                              onSettled: () => {
                                setPendingId(null);
                                setPendingAction(null);
                              },
                            }
                          );
                        }}
                        disabled={!canDone}
                      >
                        {isThisPending && pendingAction === 'done' ? (
                          <>
                            <Spinner size={16} />
                            <span>Mark Done</span>
                          </>
                        ) : (
                          'Mark Done'
                        )}
                      </Button>
                      <Button
                        variant='danger'
                        size='sm'
                        className='rounded-full inline-flex items-center gap-xs'
                        onClick={() => {
                          const id = key;
                          setLocalDisabled((prev) => ({
                            ...prev,
                            [String(id)]: true,
                          }));
                          setPendingId(id);
                          if (!o.id && o.transactionId) {
                            updateLocalStatus(
                              String(o.transactionId),
                              'cancelled'
                            );
                          }
                          setStatusOverride((prev) => ({
                            ...prev,
                            [String(key)]: 'cancelled',
                          }));
                          setPendingAction('cancelled');
                          upd.mutate(
                            { id, status: 'cancelled' },
                            {
                              onError: () => {
                                setLocalDisabled((prev) => {
                                  const next = { ...prev };
                                  delete next[String(id)];
                                  return next;
                                });
                                setStatusOverride((prev) => {
                                  const n = { ...prev };
                                  delete n[String(key)];
                                  return n;
                                });
                              },
                              onSuccess: (res: UpdateOrderStatusResponse) => {
                                const txid = res?.data?.order?.transactionId;
                                const st = String(
                                  res?.data?.order?.status
                                ) as Transaction['status'];
                                if (txid && st)
                                  updateLocalStatus(String(txid), st);
                              },
                              onSettled: () => {
                                setPendingId(null);
                                setPendingAction(null);
                              },
                            }
                          );
                        }}
                        disabled={!canCancel}
                      >
                        {isThisPending && pendingAction === 'cancelled' ? (
                          <>
                            <Spinner size={16} />
                            <span>Cancelled</span>
                          </>
                        ) : (
                          'Cancelled'
                        )}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      <div className='mt-3xl flex justify-center'>
        <Button variant='neutral' onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    </Container>
  );
}
