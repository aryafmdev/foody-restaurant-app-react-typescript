import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { http } from '../api/http';
import {
  RestaurantListResponseSchema,
  RecommendedRestaurantsResponseSchema,
  RestaurantDetailResponseSchema,
} from '../../types/schemas';

const FALLBACK_LAT = -6.175392;
const FALLBACK_LONG = 106.827153;

export function useRestaurantsQuery(params?: {
  q?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  page?: number;
  limit?: number;
  lat?: number;
  long?: number;
}) {
  return useQuery({
    queryKey: ['restaurants', 'list', params ?? {}],
    queryFn: async () => {
      const res = await http.get('/api/resto', {
        params: {
          ...params,
          lat: params?.lat ?? FALLBACK_LAT,
          long: params?.long ?? FALLBACK_LONG,
        },
      });
      return RestaurantListResponseSchema.parse(res.data);
    },
  });
}

export function useRecommendedRestaurantsQuery() {
  return useQuery({
    queryKey: ['restaurants', 'recommended'],
    retry: false,
    queryFn: async () => {
      try {
        const res = await http.get('/api/resto/recommended');
        return RecommendedRestaurantsResponseSchema.parse(res.data);
      } catch (err: unknown) {
        const status = (err as AxiosError)?.response?.status;
        if (status === 401) {
          const listRes = await http.get('/api/resto', {
            params: {
              page: 1,
              limit: 12,
              lat: FALLBACK_LAT,
              long: FALLBACK_LONG,
            },
          });
          const listParsed = RestaurantListResponseSchema.parse(listRes.data);
          return RecommendedRestaurantsResponseSchema.parse({
            success: true,
            data: {
              recommendations: listParsed.data.restaurants,
              message: 'fallback: public list',
            },
          });
        }
        throw err;
      }
    },
  });
}

export function useRestaurantDetailQuery(
  id: number,
  params?: {
    limitMenu?: number;
    limitReview?: number;
    lat?: number;
    long?: number;
  }
) {
  return useQuery({
    queryKey: ['restaurants', 'detail', id, params ?? {}],
    queryFn: async () => {
      const res = await http.get(`/api/resto/${id}`, {
        params: {
          ...params,
          lat: params?.lat ?? FALLBACK_LAT,
          long: params?.long ?? FALLBACK_LONG,
        },
      });
      return RestaurantDetailResponseSchema.parse(res.data);
    },
    enabled: !!id,
  });
}

export function useAllRestaurantsQuery(params?: {
  q?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  lat?: number;
  long?: number;
}) {
  return useQuery({
    queryKey: ['restaurants', 'all', params ?? {}],
    queryFn: async () => {
      const first = await http.get('/api/resto', {
        params: {
          page: 1,
          limit: 24,
          ...params,
          lat: params?.lat ?? FALLBACK_LAT,
          long: params?.long ?? FALLBACK_LONG,
        },
      });
      const parsedFirst = RestaurantListResponseSchema.parse(first.data);
      const pag = parsedFirst.data.pagination;
      const totalPages = pag?.totalPages ?? 1;
      const limit = pag?.limit ?? 24;
      const acc = [...parsedFirst.data.restaurants];
      for (let p = 2; p <= totalPages; p++) {
        const res = await http.get('/api/resto', {
          params: {
            page: p,
            limit,
            ...params,
            lat: params?.lat ?? FALLBACK_LAT,
            long: params?.long ?? FALLBACK_LONG,
          },
        });
        const parsed = RestaurantListResponseSchema.parse(res.data);
        acc.push(...parsed.data.restaurants);
      }
      return RestaurantListResponseSchema.parse({
        success: true,
        data: {
          restaurants: acc,
          pagination: {
            page: 1,
            limit,
            total: pag?.total ?? acc.length,
            totalPages: 1,
          },
        },
      });
    },
  });
}
