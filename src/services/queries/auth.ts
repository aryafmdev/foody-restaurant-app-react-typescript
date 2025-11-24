import { useMutation, useQuery } from '@tanstack/react-query';
import { http } from '../api/http';
import { z } from 'zod';
import { UserSchema } from '../../types/schemas';

const RegisterResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ user: UserSchema, token: z.string() }),
});

const LoginResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ user: UserSchema, token: z.string() }),
});

const ProfileResponseSchema = z.object({ success: z.boolean(), data: UserSchema });

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (body: { name: string; email: string; phone: string; password: string }) => {
      const res = await http.post('/api/auth/register', body);
      return RegisterResponseSchema.parse(res.data);
    },
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const res = await http.post('/api/auth/login', body);
      return LoginResponseSchema.parse(res.data);
    },
  });
}

export function useProfileQuery() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const res = await http.get('/api/auth/profile');
      return ProfileResponseSchema.parse(res.data);
    },
  });
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: async (body: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }) => {
      const res = await http.put('/api/auth/profile', body);
      return ProfileResponseSchema.parse(res.data);
    },
  });
}
