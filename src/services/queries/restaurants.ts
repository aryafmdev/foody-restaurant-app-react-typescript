import { useQuery } from '@tanstack/react-query';
import { http } from '../api/http';
import { RestaurantListResponseSchema, RecommendedRestaurantsResponseSchema, RestaurantDetailResponseSchema } from '../../types/schemas';

export function useRestaurantsQuery(params?: { q?: string; priceMin?: number; priceMax?: number; rating?: number; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['restaurants', 'list', params ?? {}],
    queryFn: async () => {
      const res = await http.get('/api/resto', { params });
      return RestaurantListResponseSchema.parse(res.data);
    },
  });
}

export function useRecommendedRestaurantsQuery() {
  return useQuery({
    queryKey: ['restaurants', 'recommended'],
    queryFn: async () => {
      const res = await http.get('/api/resto/recommended');
      return RecommendedRestaurantsResponseSchema.parse(res.data);
    },
  });
}

export function useRestaurantDetailQuery(id: number, params?: { limit?: number }) {
  return useQuery({
    queryKey: ['restaurants', 'detail', id, params ?? {}],
    queryFn: async () => {
      const res = await http.get(`/api/resto/${id}`, { params });
      return RestaurantDetailResponseSchema.parse(res.data);
    },
    enabled: !!id,
  });
}
