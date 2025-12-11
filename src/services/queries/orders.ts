import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../api/http';
import { CheckoutResponseSchema, UpdateOrderStatusResponseSchema, TransactionSchema } from '../../types/schemas';
import { z } from 'zod';
import type { Transaction } from '../../types/schemas';

const MyOrdersResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    orders: z.array(TransactionSchema),
    pagination: z.object({ page: z.number(), limit: z.number(), total: z.number(), totalPages: z.number() }).optional(),
    filter: z.object({ status: z.string().optional() }).optional(),
  }),
});

function hk(u: string) {
  return `orders_history_${u}`;
}
function hload(u: string): Transaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(hk(u));
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}
function hsave(u: string, arr: Transaction[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(hk(u), JSON.stringify(arr));
  } catch {
    return;
  }
}
export function getOrderHistory(userKey?: string | null): Transaction[] {
  const key = userKey ?? 'guest';
  return hload(key);
}
export function putOrderHistory(userKey: string | null | undefined, tx: Transaction) {
  const key = userKey ?? 'guest';
  const arr = hload(key);
  const idx = arr.findIndex((t) => t.transactionId === tx.transactionId);
  const next = idx >= 0 ? Object.assign([...arr], { [idx]: tx }) : [...arr, tx];
  const limited = next.slice(-50);
  hsave(key, limited);
}

export function useCheckoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      paymentMethod?: string;
      restaurants?: Array<{
        restaurantId: number;
        items: Array<{ menuId: number; quantity: number }>;
      }>;
      deliveryAddress?: string;
      phone?: string;
      notes?: string;
    }) => {
      const res = await http.post('/api/order/checkout', body);
      return CheckoutResponseSchema.parse(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['orders', 'my'] });
    },
  });
}

export function useMyOrdersQuery(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['orders', 'my', params ?? {}],
    queryFn: async () => {
      const res = await http.get('/api/order/my-order', { params });
      return MyOrdersResponseSchema.parse(res.data);
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number | string; status: 'preparing' | 'on_the_way' | 'delivered' | 'done' | 'cancelled' }) => {
      const res = await http.put(`/api/order/${payload.id}/status`, { status: payload.status });
      return UpdateOrderStatusResponseSchema.parse(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders', 'my'] });
    },
  });
}
