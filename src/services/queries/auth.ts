import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

const ProfileResponseSchema = z.object({ success: z.boolean(), message: z.string().optional(), data: UserSchema });

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

export function useProfileQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const res = await http.get('/api/auth/profile');
      return ProfileResponseSchema.parse(res.data);
    },
    enabled,
    retry: false,
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      name?: string;
      email?: string;
      phone?: string;
      avatarFile?: File | Blob | null;
      currentPassword?: string;
      newPassword?: string;
    }) => {
      const useMultipart = !!body.avatarFile || body.email != null;
      if (useMultipart) {
        const form = new FormData();
        if (body.name != null) form.append('name', body.name);
        if (body.email != null) form.append('email', body.email);
        if (body.phone != null) form.append('phone', body.phone);
        if (body.avatarFile) form.append('avatar', body.avatarFile);
        const res = await http.put('/api/auth/profile', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return ProfileResponseSchema.parse(res.data);
      } else {
        const payload = {
          name: body.name,
          phone: body.phone,
          currentPassword: body.currentPassword,
          newPassword: body.newPassword,
        };
        const res = await http.put('/api/auth/profile', payload);
        return ProfileResponseSchema.parse(res.data);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
  });
}
