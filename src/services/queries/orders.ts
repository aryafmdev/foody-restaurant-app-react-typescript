import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../api/http';
import { CheckoutResponseSchema, UpdateOrderStatusResponseSchema } from '../../types/schemas';
import { z } from 'zod';

const MyOrdersResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    orders: z.array(z.any()),
    pagination: z.object({ page: z.number(), limit: z.number(), total: z.number(), totalPages: z.number() }).optional(),
    filter: z.object({ status: z.string().optional() }).optional(),
  }),
});

export function useCheckoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { paymentMethod?: string }) => {
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
    mutationFn: async (payload: { id: number; status: 'preparing' | 'on_the_way' | 'delivered' | 'done' | 'cancelled' }) => {
      const res = await http.put(`/api/order/${payload.id}/status`, { status: payload.status });
      return UpdateOrderStatusResponseSchema.parse(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders', 'my'] });
    },
  });
}
