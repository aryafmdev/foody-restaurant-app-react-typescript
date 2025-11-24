import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../api/http';
import { GetCartResponseSchema, AddCartItemResponseSchema } from '../../types/schemas';

export function useCartQuery() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await http.get('/api/cart');
      return GetCartResponseSchema.parse(res.data);
    },
  });
}

export function useAddToCartMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { restaurantId: number; menuId: number; quantity?: number }) => {
      const res = await http.post('/api/cart', body);
      return AddCartItemResponseSchema.parse(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCartMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await http.delete('/api/cart');
      return res.data as { success: boolean; message?: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; quantity: number }) => {
      const res = await http.put(`/api/cart/${payload.id}`, { quantity: payload.quantity });
      return res.data as { success: boolean };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useDeleteCartItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await http.delete(`/api/cart/${id}`);
      return res.data as { success: boolean; message?: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
