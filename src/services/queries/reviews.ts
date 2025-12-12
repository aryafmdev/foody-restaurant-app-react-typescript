import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../api/http';
import {
  CreateReviewResponseSchema,
  RestaurantReviewsResponseSchema,
  MyReviewsResponseSchema,
  UpdateReviewResponseSchema,
  DeleteReviewResponseSchema,
} from '../../types/schemas';

export function useCreateReviewMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      transactionId: string;
      restaurantId: number;
      star: number;
      comment?: string;
      menuIds?: number[];
    }) => {
      const res = await http.post('/api/review', body);
      return CreateReviewResponseSchema.parse(res.data);
    },
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ['reviews', 'my'] });
      const rid = variables?.restaurantId;
      if (typeof rid === 'number') {
        qc.invalidateQueries({ queryKey: ['reviews', 'restaurant', rid] });
        qc.invalidateQueries({ queryKey: ['restaurants', 'detail', rid] });
      }
    },
  });
}

export function useRestaurantReviewsQuery(
  restaurantId: number,
  params?: { page?: number; limit?: number; rating?: number }
) {
  return useQuery({
    queryKey: ['reviews', 'restaurant', restaurantId, params ?? {}],
    queryFn: async () => {
      const res = await http.get(`/api/review/restaurant/${restaurantId}`, {
        params,
      });
      return RestaurantReviewsResponseSchema.parse(res.data);
    },
    enabled: !!restaurantId,
  });
}

export function useMyReviewsQuery(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['reviews', 'my', params ?? {}],
    queryFn: async () => {
      const res = await http.get('/api/review/my-reviews', { params });
      return MyReviewsResponseSchema.parse(res.data);
    },
  });
}

export function useUpdateReviewMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: number;
      star?: number;
      comment?: string;
    }) => {
      const res = await http.put(`/api/review/${payload.id}`, {
        star: payload.star,
        comment: payload.comment,
      });
      return UpdateReviewResponseSchema.parse(res.data);
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['reviews', 'my'] });
      const rid = res?.data?.review?.restaurant?.id;
      if (typeof rid === 'number') {
        qc.invalidateQueries({ queryKey: ['reviews', 'restaurant', rid] });
        qc.invalidateQueries({ queryKey: ['restaurants', 'detail', rid] });
      }
    },
  });
}

export function useDeleteReviewMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await http.delete(`/api/review/${id}`);
      return DeleteReviewResponseSchema.parse(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', 'my'] });
    },
  });
}
