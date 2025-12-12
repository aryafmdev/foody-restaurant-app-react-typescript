import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Icon } from '../ui/icon';
import { Checkbox, CheckboxLabel } from '../ui/checkbox';
import { Image } from '../ui/image';
import logo from '../assets/images/logo.png';
import loginImg from '../assets/images/image-login.png';
import {
  useLoginMutation,
  useRegisterMutation,
} from '../services/queries/auth';
import { setToken, setUserId, setUser } from '../features/auth/slice';
import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Minimum 6 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, 'Use letters and numbers'),
  remember: z.boolean().optional(),
});

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialTab = (
    searchParams.get('tab') === 'signup' ? 'signup' : 'signin'
  ) as 'signin' | 'signup';
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const login = useLoginMutation();
  const register = useRegisterMutation();
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupShowConfirm, setSignupShowConfirm] = useState(false);
  const [signupErrors, setSignupErrors] = useState<{
    name?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    confirm?: string[];
    form?: string[];
  }>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const showToast = (m: string, t: 'success' | 'error' = 'success') => {
    setToastMsg(m);
    setToastType(t);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 2000);
  };

  const RegisterSchema = z
    .object({
      name: z.string().min(2, 'Minimum 2 characters'),
      email: z.string().email('Invalid email format'),
      phone: z.string().regex(/^\d{10,13}$/i, 'Use 10–13 digits'),
      password: z
        .string()
        .min(6, 'Minimum 6 characters')
        .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, 'Use letters and numbers'),
      confirm: z.string(),
    })
    .refine((d) => d.confirm === d.password, {
      path: ['confirm'],
      message: 'Passwords do not match',
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailNormalized = email.trim().toLowerCase();
    const passwordNormalized = password.trim();
    const parsed = LoginSchema.safeParse({
      email: emailNormalized,
      password: passwordNormalized,
      remember,
    });
    if (!parsed.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      parsed.error.issues.forEach((iss) => {
        if (iss.path[0] === 'email') fieldErrors.email = iss.message;
        if (iss.path[0] === 'password') fieldErrors.password = iss.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    try {
      const res = await login.mutateAsync({
        email: emailNormalized,
        password: passwordNormalized,
      });
      const token = res.data.token;
      const userId = String(res.data.user.id);
      let savedLat: number | null = null;
      let savedLong: number | null = null;
      try {
        const raw = localStorage.getItem('userlocation');
        if (raw) {
          const obj = JSON.parse(raw) as {
            latitude?: unknown;
            longitude?: unknown;
          };
          const latVal =
            typeof obj.latitude === 'number'
              ? (obj.latitude as number)
              : Number(obj.latitude);
          const longVal =
            typeof obj.longitude === 'number'
              ? (obj.longitude as number)
              : Number(obj.longitude);
          if (Number.isFinite(latVal) && Number.isFinite(longVal)) {
            savedLat = latVal;
            savedLong = longVal;
          }
        }
      } catch {
        savedLat = null;
        savedLong = null;
      }
      const nextUser = {
        id: String(res.data.user.id),
        name: res.data.user.name ?? null,
        email: res.data.user.email ?? null,
        phone: res.data.user.phone ?? null,
        avatar: res.data.user.avatar ?? null,
        latitude:
          (savedLat ?? (res.data.user.latitude ?? null)) ?? null,
        longitude:
          (savedLong ?? (res.data.user.longitude ?? null)) ?? null,
      };
      dispatch(setToken(token));
      dispatch(setUserId(userId));
      dispatch(setUser(nextUser));
      try {
        sessionStorage.setItem(
          'auth',
          JSON.stringify({ token, userId, user: nextUser })
        );
      } catch {
        void 0;
      }
      qc.setQueryData(['auth', 'profile'], {
        success: true,
        data: {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone,
          avatar: res.data.user.avatar,
          latitude: nextUser.latitude ?? null,
          longitude: nextUser.longitude ?? null,
          createdAt: res.data.user.createdAt,
        },
      });
      if (remember) {
        try {
          localStorage.setItem(
            'auth',
            JSON.stringify({ token, userId, user: nextUser })
          );
        } catch {
          void 0;
        }
      } else {
        try {
          localStorage.removeItem('auth');
        } catch {
          void 0;
        }
      }
      showToast(
        `Login berhasil. Selamat datang, ${res.data.user.name}!`,
        'success'
      );
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const anyErr = err as unknown as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = anyErr?.response?.status;
      const serverMsg = anyErr?.response?.data?.message;
      const msg =
        serverMsg ?? (status ? `Login gagal (${status})` : 'Login gagal');
      showToast(msg, 'error');
      const lower = (serverMsg ?? '').toLowerCase();
      const fe: { email?: string; password?: string } = {};
      if (lower.includes('email')) fe.email = serverMsg ?? 'Email tidak valid';
      if (lower.includes('password'))
        fe.password = serverMsg ?? 'Password tidak valid';
      if (!fe.email && !fe.password) fe.email = 'Email atau password salah';
      setErrors(fe);
    }
  };

  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameNormalized = signupName.trim();
    const emailNormalized = signupEmail.trim().toLowerCase();
    const phoneNormalized = signupPhone.trim();
    const passwordNormalized = signupPassword.trim();
    const confirmNormalized = signupConfirm.trim();
    const parsed = RegisterSchema.safeParse({
      name: nameNormalized,
      email: emailNormalized,
      phone: phoneNormalized,
      password: passwordNormalized,
      confirm: confirmNormalized,
    });
    if (!parsed.success) {
      const fieldErrors: {
        name?: string[];
        email?: string[];
        phone?: string[];
        password?: string[];
        confirm?: string[];
      } = {};
      parsed.error.issues.forEach((iss) => {
        const key = String(iss.path[0]) as
          | 'name'
          | 'email'
          | 'phone'
          | 'password'
          | 'confirm';
        fieldErrors[key] = [...(fieldErrors[key] ?? []), iss.message];
      });
      setSignupErrors(fieldErrors);
      return;
    }
    setSignupErrors({});
    try {
      const res = await register.mutateAsync({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        password: parsed.data.password,
      });
      const token = res.data.token;
      const userId = String(res.data.user.id);
      let savedLat: number | null = null;
      let savedLong: number | null = null;
      try {
        const raw = localStorage.getItem('userlocation');
        if (raw) {
          const obj = JSON.parse(raw) as {
            latitude?: unknown;
            longitude?: unknown;
          };
          const latVal =
            typeof obj.latitude === 'number'
              ? (obj.latitude as number)
              : Number(obj.latitude);
          const longVal =
            typeof obj.longitude === 'number'
              ? (obj.longitude as number)
              : Number(obj.longitude);
          if (Number.isFinite(latVal) && Number.isFinite(longVal)) {
            savedLat = latVal;
            savedLong = longVal;
          }
        }
      } catch {
        savedLat = null;
        savedLong = null;
      }
      const nextUser = {
        id: String(res.data.user.id),
        name: res.data.user.name ?? null,
        email: res.data.user.email ?? null,
        phone: res.data.user.phone ?? null,
        avatar: res.data.user.avatar ?? null,
        latitude:
          (savedLat ?? (res.data.user.latitude ?? null)) ?? null,
        longitude:
          (savedLong ?? (res.data.user.longitude ?? null)) ?? null,
      };
      dispatch(setToken(token));
      dispatch(setUserId(userId));
      dispatch(setUser(nextUser));
      try {
        sessionStorage.setItem(
          'auth',
          JSON.stringify({ token, userId, user: nextUser })
        );
      } catch {
        void 0;
      }
      qc.setQueryData(['auth', 'profile'], {
        success: true,
        data: {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone,
          avatar: res.data.user.avatar,
          latitude: nextUser.latitude ?? null,
          longitude: nextUser.longitude ?? null,
          createdAt: res.data.user.createdAt,
        },
      });
      showToast('Registration successful. You are now signed in.', 'success');
      setTimeout(() => navigate('/', { replace: true }), 1200);
    } catch (err) {
      const anyErr = err as unknown as {
        response?: {
          status?: number;
          data?: { message?: string; errors?: unknown };
        };
      };
      const status = anyErr?.response?.status;
      const serverMsg = anyErr?.response?.data?.message;
      const errorsRaw = anyErr?.response?.data?.errors;
      const fieldErrors: { [k: string]: string[] } = {};
      const pushField = (key: string, msgs: string[]) => {
        if (['name', 'email', 'phone', 'password', 'confirm'].includes(key)) {
          fieldErrors[key] = [
            ...(fieldErrors[key] ?? []),
            ...msgs.filter(Boolean),
          ];
        } else {
          const labeled = msgs.filter(Boolean).map((m) => `${key}: ${m}`);
          fieldErrors.form = [...(fieldErrors.form ?? []), ...labeled];
        }
      };
      const normalize = (v: unknown): string[] => {
        if (v == null) return [];
        if (Array.isArray(v)) return v.flatMap(normalize);
        const t = typeof v;
        if (t === 'string') return [v as string];
        if (t === 'number' || t === 'boolean') return [String(v)];
        if (t === 'object') {
          const obj = v as Record<string, unknown>;
          if ('message' in obj && typeof obj.message === 'string')
            return [obj.message as string];
          if ('messages' in obj && Array.isArray(obj.messages))
            return (obj.messages as unknown[]).flatMap(normalize);
          return Object.values(obj).flatMap(normalize);
        }
        return [String(v)];
      };
      if (Array.isArray(errorsRaw)) {
        const msgs = (errorsRaw as unknown[]).flatMap(normalize);
        msgs.forEach((msg) => {
          const lower = String(msg).toLowerCase();
          if (lower.includes('email')) pushField('email', [String(msg)]);
          else if (lower.includes('phone')) pushField('phone', [String(msg)]);
          else if (lower.includes('name') || lower.includes('username'))
            pushField('name', [String(msg)]);
          else if (lower.includes('password'))
            pushField('password', [String(msg)]);
          else pushField('form', [String(msg)]);
        });
      } else if (errorsRaw && typeof errorsRaw === 'object') {
        Object.entries(errorsRaw as Record<string, unknown>).forEach(
          ([k, v]) => {
            const msgs = normalize(v);
            pushField(k, msgs.length ? msgs : ['Invalid']);
          }
        );
      }
      if (!Object.keys(fieldErrors).length) {
        fieldErrors.form = [
          serverMsg ??
            (status
              ? `Registration failed (${status})`
              : 'Registration failed'),
        ];
      }
      setSignupErrors((prev) => ({ ...prev, ...fieldErrors }));
      const toastMsg =
        serverMsg ??
        (status ? `Registration failed (${status})` : 'Registration failed');
      const extraList = Object.values(fieldErrors).flat().filter(Boolean);
      const extra = extraList.length ? `\n- ${extraList.join('\n- ')}` : '';
      showToast(toastMsg + extra, 'error');
    }
  };

  const logoMaskStyle = {
    WebkitMaskImage: `url(${logo})`,
    maskImage: `url(${logo})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  } as CSSProperties;

  return (
    <div className='min-h-screen'>
      <div className='md:grid md:grid-cols-2'>
        <div className='hidden md:block bg-neutral-950'>
          <Image
            alt='Login'
            src={loginImg}
            className='h-screen w-full object-cover rounded-none'
          />
        </div>
        <div className='min-h-screen flex items-center justify-center p-2xl bg-white'>
          <Card className='border-none shadow-none'>
            <CardContent className='p-none'>
              <div className='max-w-[345px] md:max-w-[374px]'>
                <div className='inline-flex items-center gap-sm'>
                  <span
                    className='inline-block size-7 bg-primary'
                    style={logoMaskStyle}
                  />
                  <span className='font-extrabold text-display-md text-neutral-950'>
                    Foody
                  </span>
                </div>
                <div className='mt-xl text-display-xs md:text-display-sm font-extrabold text-neutral-950'>
                  Welcome Back
                </div>
                <div className='mt-xs text-md font-medium text-neutral-950'>
                  Good to see you again! Let's eat
                </div>

                <div className='mt-xl bg-neutral-100 rounded-lg p-md'>
                  <div className={cn('grid grid-cols-2 gap-sm')}>
                    <Button
                      size='sm'
                      variant='ghost'
                      className={cn(
                        'rounded-lg bg-white text-neutral-950 border-none w-full',
                        tab === 'signin'
                          ? 'font-extrabold'
                          : 'font-medium bg-transparent text-neutral-600'
                      )}
                      style={{ borderRadius: '0.5rem' }}
                      onClick={() => {
                        setTab('signin');
                        navigate('/login?tab=signin');
                      }}
                    >
                      Sign in
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className={cn(
                        'rounded-lg bg-white text-neutral-950 border-none w-full',
                        tab === 'signup'
                          ? 'font-extrabold'
                          : 'font-medium bg-transparent text-neutral-600'
                      )}
                      style={{ borderRadius: '0.5rem' }}
                      onClick={() => {
                        setTab('signup');
                        navigate('/login?tab=signup');
                      }}
                    >
                      Sign up
                    </Button>
                  </div>
                </div>

                {tab === 'signin' ? (
                  <form onSubmit={onSubmit} className='mt-2xl space-y-2xl'>
                    <div>
                      <div className='relative'>
                        <Input
                          type='email'
                          placeholder=' '
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          variant={errors.email ? 'error' : 'default'}
                          className='peer placeholder-transparent pt-5'
                        />
                        <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                          Email
                        </span>
                      </div>
                      {errors.email ? (
                        <div className='mt-xxs text-sm text-primary'>
                          {errors.email}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder=' '
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          variant={errors.password ? 'error' : 'default'}
                          className='peer placeholder-transparent pt-5 pr-10'
                        />
                        <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                          Password
                        </span>
                        <button
                          type='button'
                          className='absolute right-md top-1/2 -translate-y-1/2 text-neutral-500'
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          onClick={() => setShowPassword((s) => !s)}
                        >
                          <Icon
                            name={
                              showPassword
                                ? 'iconamoon:eye-off'
                                : 'solar:eye-linear'
                            }
                            size={20}
                            className='text-neutral-950'
                          />
                        </button>
                      </div>
                      {errors.password ? (
                        <div className='mt-xxs text-sm text-primary'>
                          {errors.password}
                        </div>
                      ) : null}
                    </div>

                    <div className='inline-flex items-center'>
                      <Checkbox
                        checked={remember}
                        onChange={(e) => setRemember(e.currentTarget.checked)}
                      />
                      <CheckboxLabel className='text-neutral-950'>
                        Remember Me
                      </CheckboxLabel>
                    </div>

                    <Button
                      type='submit'
                      disabled={login.isPending}
                      className='w-full'
                    >
                      {login.isPending ? 'Signing in...' : 'Login'}
                    </Button>
                  </form>
                ) : (
                  <form
                    onSubmit={onSubmitRegister}
                    className='mt-2xl space-y-2xl'
                  >
                    {signupErrors.form && signupErrors.form.length ? (
                      <div className='text-sm text-primary'>
                        {signupErrors.form.map((m, i) => (
                          <div key={i}>{m}</div>
                        ))}
                      </div>
                    ) : null}
                    <div>
                      <div className='relative'>
                        <Input
                          placeholder=' '
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          variant={
                            signupErrors.name?.length ? 'error' : 'default'
                          }
                          className='peer placeholder-transparent pt-5'
                        />
                        <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                          Name
                        </span>
                      </div>
                      {signupErrors.name && signupErrors.name.length ? (
                        <div className='mt-xxs text-sm text-primary'>
                          {signupErrors.name.map((m, i) => (
                            <div key={i}>{m}</div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <div className='relative'>
                        <Input
                          type='email'
                          placeholder=' '
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          variant={
                            signupErrors.email?.length ? 'error' : 'default'
                          }
                          className='peer placeholder-transparent pt-5'
                        />
                        <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                          Email
                        </span>
                      </div>
                      {signupErrors.email && signupErrors.email.length ? (
                        <div className='mt-xxs text-sm text-primary'>
                          {signupErrors.email.map((m, i) => (
                            <div key={i}>{m}</div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <div className='relative'>
                        <Input
                          placeholder=' '
                          value={signupPhone}
                          onChange={(e) =>
                            setSignupPhone(e.target.value.replace(/[^\d]/g, ''))
                          }
                          variant={
                            signupErrors.phone?.length ? 'error' : 'default'
                          }
                          className='peer placeholder-transparent pt-5'
                        />
                        <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                          Number Phone
                        </span>
                      </div>
                      {signupErrors.phone && signupErrors.phone.length ? (
                        <div className='mt-xxs text-sm text-primary'>
                          {signupErrors.phone.map((m, i) => (
                            <div key={i}>{m}</div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <div className='relative'>
                        <Input
                          type={signupShowPassword ? 'text' : 'password'}
                          placeholder=' '
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          variant={
                            signupErrors.password?.length ? 'error' : 'default'
                          }
                          className='peer placeholder-transparent pt-5 pr-10'
                        />
                        <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                          Password
                        </span>
                        <button
                          type='button'
                          className='absolute right-md top-1/2 -translate-y-1/2 text-neutral-500'
                          onClick={() => setSignupShowPassword((s) => !s)}
                          aria-label={
                            signupShowPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          <Icon
                            name={
                              signupShowPassword
                                ? 'iconamoon:eye-off'
                                : 'solar:eye-linear'
                            }
                            size={20}
                            className='text-neutral-950'
                          />
                        </button>
                      </div>
                      {signupErrors.password && signupErrors.password.length ? (
                        <div className='mt-xxs text-sm text-primary'>
                          {signupErrors.password.map((m, i) => (
                            <div key={i}>{m}</div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <div className='relative'>
                        <Input
                          type={signupShowConfirm ? 'text' : 'password'}
                          placeholder=' '
                          value={signupConfirm}
                          onChange={(e) => setSignupConfirm(e.target.value)}
                          variant={
                            signupErrors.confirm?.length ? 'error' : 'default'
                          }
                          className='peer placeholder-transparent pt-5 pr-10'
                        />
                        <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                          Confirm Password
                        </span>
                        <button
                          type='button'
                          className='absolute right-md top-1/2 -translate-y-1/2 text-neutral-500'
                          onClick={() => setSignupShowConfirm((s) => !s)}
                          aria-label={
                            signupShowConfirm
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          <Icon
                            name={
                              signupShowConfirm
                                ? 'iconamoon:eye-off'
                                : 'solar:eye-linear'
                            }
                            size={20}
                            className='text-neutral-950'
                          />
                        </button>
                      </div>
                      {signupErrors.confirm && signupErrors.confirm.length ? (
                        <div className='mt-xxs text-sm text-primary'>
                          {signupErrors.confirm.map((m, i) => (
                            <div key={i}>{m}</div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <Button
                      type='submit'
                      disabled={register.isPending}
                      className='w-full'
                    >
                      {register.isPending ? 'Registering...' : 'Register'}
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {toastOpen ? (
        <div className='fixed top-4 right-4 z-50'>
          <div
            className={`rounded-lg px-lg py-sm shadow-lg text-sm font-medium ${
              toastType === 'success'
                ? 'bg-accent-green text-white'
                : 'bg-accent-red text-white'
            }`}
          >
            {toastMsg}
          </div>
        </div>
      ) : null}
    </div>
  );
}
