import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { Container } from '../ui/container';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { SidebarProfile } from '../components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import avatarImg from '../assets/images/avatar.png';
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from '../services/queries/auth';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Icon } from '../ui/icon';
import { Spinner } from '../ui/spinner';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/slice';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const userId = useSelector((s: RootState) => s.auth.userId);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const isLoggedIn = !!token;
  const { data: profile, isLoading, error } = useProfileQuery(isLoggedIn);
  const user = authUser ?? profile?.data;

  useEffect(() => {
    if (!isLoggedIn) navigate('/login?tab=signin');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const anyErr = error as { response?: { status?: number } } | undefined;
    if (anyErr?.response?.status === 401) navigate('/login?tab=signin');
  }, [error, navigate]);

  const displayName = useMemo(() => user?.name ?? 'John Doe', [user]);
  const email = user?.email ?? 'user@example.com';
  const phone = user?.phone ?? '081234567890';

  const updateProfile = useUpdateProfileMutation();
  const [open, setOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [formError, setFormError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentError, setCurrentError] = useState('');
  const [newError, setNewError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [origName, setOrigName] = useState('');
  const [origPhone, setOrigPhone] = useState('');
  const [origEmail, setOrigEmail] = useState('');
  const showToast = (type: 'success' | 'error', msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  };

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarChangePending, setAvatarChangePending] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const onClickChangeAvatar = () => {
    setAvatarError('');
    avatarInputRef.current?.click();
  };
  const onChangeAvatarFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    setAvatarError('');
    const isImage = (f.type || '').startsWith('image/');
    const isSizeOk = f.size <= 5 * 1024 * 1024;
    if (!isImage) {
      setAvatarError('Avatar must be an image');
      showToast('error', 'Avatar must be an image');
      e.target.value = '';
      return;
    }
    if (!isSizeOk) {
      setAvatarError('Avatar must be <= 5MB');
      showToast('error', 'Avatar must be <= 5MB');
      e.target.value = '';
      return;
    }
    try {
      setAvatarChangePending(true);
      const res = await updateProfile.mutateAsync({ avatarFile: f });
      const resp = res as unknown as {
        data?: unknown;
        message?: string;
        success?: boolean;
      };
      const serverDataRaw = resp?.data;
      const asObj = (v: unknown): Record<string, unknown> =>
        v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
      const asStr = (v: unknown): string | undefined =>
        typeof v === 'string' ? (v as string) : undefined;
      const root = asObj(serverDataRaw);
      const userObj = asObj(root['user']);
      const dataObj = asObj(root['data']);
      const nestedUserObj = asObj(dataObj['user']);
      const nextAvatar: string | undefined =
        asStr(root['avatar']) ??
        asStr(userObj['avatar']) ??
        asStr(dataObj['avatar']) ??
        asStr(nestedUserObj['avatar']) ??
        URL.createObjectURL(f);
      const nextUser = {
        id: String(root['id'] ?? authUser?.id ?? ''),
        name: asStr(root['name']) ?? authUser?.name ?? null,
        email: asStr(root['email']) ?? authUser?.email ?? null,
        phone: asStr(root['phone']) ?? authUser?.phone ?? null,
        avatar: nextAvatar ?? null,
        latitude:
          (typeof root['latitude'] === 'number'
            ? (root['latitude'] as number)
            : authUser?.latitude ?? null) ?? null,
        longitude:
          (typeof root['longitude'] === 'number'
            ? (root['longitude'] as number)
            : authUser?.longitude ?? null) ?? null,
      };
      dispatch(setUser(nextUser));
      try {
        const storedRaw =
          localStorage.getItem('auth') ?? sessionStorage.getItem('auth');
        const stored = storedRaw ? JSON.parse(storedRaw) : {};
        const tokenStored = stored?.token ?? token;
        const userIdStored = stored?.userId ?? userId;
        const payload = {
          token: tokenStored,
          userId: userIdStored,
          user: { ...stored?.user, ...nextUser },
        };
        if (localStorage.getItem('auth'))
          localStorage.setItem('auth', JSON.stringify(payload));
        else sessionStorage.setItem('auth', JSON.stringify(payload));
      } catch {
        void 0;
      }
      showToast('success', 'Avatar updated successfully');
    } catch (err) {
      const anyErr = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      const msg = anyErr?.response?.data?.message ?? 'Update failed, image file max 5MB';
      const errs = anyErr?.response?.data?.errors ?? [];
      const full = [msg, ...errs].filter(Boolean).join(' • ');
      setAvatarError(full);
      showToast('error', full);
    } finally {
      setAvatarChangePending(false);
      e.target.value = '';
    }
  };

  const onSave = async () => {
    setFormError('');
    setNameError('');
    setPhoneError('');
    setEmailError('');
    setCurrentError('');
    setNewError('');
    const n = nameInput.trim();
    const p = phoneInput.trim();
    const e = emailInput.trim();
    if (n.length < 2) {
      setNameError('Name must be at least 2 characters');
      showToast('error', 'Name must be at least 2 characters');
      return;
    }
    if (!/^\d{10,13}$/.test(p)) {
      setPhoneError('Phone must be 10–13 digits');
      showToast('error', 'Phone must be 10–13 digits');
      return;
    }
    if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setEmailError('Invalid email format');
      showToast('error', 'Invalid email format');
      return;
    }
    if (currentPassword || newPassword) {
      if (currentPassword.length < 6) {
        setCurrentError('Current password must be at least 6 characters');
        showToast('error', 'Current password must be at least 6 characters');
        return;
      }
      if (newPassword.length < 8) {
        setNewError('New password must be at least 8 characters');
        showToast('error', 'New password must be at least 8 characters');
        return;
      }
    }
    try {
      await updateProfile.mutateAsync({
        name: n,
        email: e || undefined,
        phone: p,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      dispatch(
        setUser({
          id: String(user?.id ?? ''),
          name: n,
          email: (e || undefined) ?? user?.email ?? null,
          phone: p,
          avatar: user?.avatar ?? null,
          latitude: user?.latitude ?? null,
          longitude: user?.longitude ?? null,
        })
      );
      setOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      const changedPwd = !!(currentPassword || newPassword);
      const changedProfile =
        n !== origName || p !== origPhone || e !== origEmail;
      const msg =
        changedPwd && changedProfile
          ? 'Profile and password updated successfully'
          : changedPwd
          ? 'Password updated successfully'
          : 'Profile updated successfully';
      showToast('success', msg);
    } catch (err: unknown) {
      const anyErr = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      const msg = anyErr?.response?.data?.message ?? 'Update failed';
      const errs = anyErr?.response?.data?.errors ?? [];
      const full = [msg, ...errs].filter(Boolean).join(' • ');
      setFormError(full);
      showToast('error', full);
    }
  };

  return (
    <>
      <Container className='py-3xl max-w-[1200px]'>
        <div className='relative mx-auto md:grid md:grid-cols-[240px_1fr] gap-3xl items-start'>
          <div className='hidden md:block md:w-[240px]'>
            <SidebarProfile
              name={displayName}
              avatar={user?.avatar ?? undefined}
              onProfile={() => navigate('/profile')}
              onDeliveryAddress={() => navigate('/address')}
              onMyOrders={() => navigate('/orders')}
              onMyReviews={() => navigate('/my-reviews')}
              onLogout={() => navigate('/login')}
              insideDialog={false}
              className='w-full md:w-[240px]'
              activeItem='profile'
            />
          </div>

          <div className='md:col-span-1'>
            <div className='text-display-md font-extrabold text-neutral-950'>
              Profile
            </div>

            <Card className='mt-5xl rounded-lg shadow-lg border w-full'>
              <CardContent className='p-xl py-2xl'>
                {isLoading ? (
                  <div className='text-md text-neutral-950'>Loading...</div>
                ) : (
                  <div className='space-y-2xl'>
                    <div className='inline-flex items-center gap-sm'>
                      <img
                        src={user?.avatar || avatarImg}
                        alt={displayName}
                        className='size-30 rounded-full object-cover'
                      />
                    </div>
                    <div className='flex items-center gap-sm'>
                      <input
                        ref={avatarInputRef}
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={onChangeAvatarFile}
                      />
                      <Button
                        variant='outline'
                        size='sm'
                        className='rounded-full'
                        onClick={onClickChangeAvatar}
                        disabled={avatarChangePending}
                      >
                        {avatarChangePending ? (
                          <span className='inline-flex items-center gap-xxs'>
                            <Spinner size={16} />
                            Changing...
                          </span>
                        ) : (
                          'Change Avatar'
                        )}
                      </Button>
                      {avatarError ? (
                        <span className='text-sm text-primary'>
                          {avatarError}
                        </span>
                      ) : null}
                    </div>
                    <div className='grid grid-cols-2 gap-y-4xl'>
                      <div className='text-md text-neutral-950'>Name</div>
                      <div className='text-md font-semibold text-neutral-950 text-right'>
                        {displayName}
                      </div>

                      <div className='text-md text-neutral-950'>Email</div>
                      <div className='text-md font-semibold text-neutral-950 text-right'>
                        {email}
                      </div>

                      <div className='text-md text-neutral-950'>
                        Nomor Handphone
                      </div>
                      <div className='text-md font-semibold text-neutral-950 text-right'>
                        {phone}
                      </div>
                    </div>

                    <div>
                      <Button
                        variant='primary'
                        className='w-full rounded-full'
                        onClick={() => {
                          const n0 = user?.name || '';
                          const p0 = user?.phone || '';
                          const e0 = user?.email || '';
                          setNameInput(n0);
                          setPhoneInput(p0);
                          setEmailInput(e0);
                          setOrigName(n0);
                          setOrigPhone(p0);
                          setOrigEmail(e0);
                          setFormError('');
                          setNameError('');
                          setPhoneError('');
                          setEmailError('');
                          setAvatarError('');
                          setCurrentError('');
                          setNewError('');
                          setOpen(true);
                        }}
                      >
                        Update Profile
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Change your name, email, phone and avatar
          </DialogDescription>
          <div className='mt-xl space-y-xl'>
            <div>
              <div className='relative'>
                <Input
                  placeholder=' '
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className='peer placeholder-transparent pt-5'
                  variant={nameError ? 'error' : 'default'}
                />
                <span className='absolute left-md top-1 text-xs text-neutral-950 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                  Name
                </span>
                {nameError ? (
                  <div className='mt-xxs text-sm text-primary'>{nameError}</div>
                ) : null}
              </div>
            </div>
            <div>
              <div className='relative'>
                <Input
                  type='email'
                  placeholder=' '
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className='peer placeholder-transparent pt-5'
                  variant={emailError ? 'error' : 'default'}
                />
                <span className='absolute left-md top-1 text-xs text-neutral-950 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                  Email
                </span>
                {emailError ? (
                  <div className='mt-xxs text-sm text-primary'>
                    {emailError}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <div className='relative'>
                <Input
                  placeholder=' '
                  value={phoneInput}
                  onChange={(e) =>
                    setPhoneInput(e.target.value.replace(/[^\d]/g, ''))
                  }
                  className='peer placeholder-transparent pt-5'
                  variant={phoneError ? 'error' : 'default'}
                />
                <span className='absolute left-md top-1 text-xs text-neutral-950 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                  Number Phone
                </span>
                {phoneError ? (
                  <div className='mt-xxs text-sm text-primary'>
                    {phoneError}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <div className='relative'>
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder=' '
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className='peer placeholder-transparent pt-5 pr-10'
                  variant={currentError ? 'error' : 'default'}
                />
                <span className='absolute left-md top-1 text-xs text-neutral-950 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                  Current Password
                </span>
                <button
                  type='button'
                  className='absolute right-md top-1/2 -translate-y-1/2 text-neutral-500'
                  onClick={() => setShowCurrent((s) => !s)}
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  <Icon
                    name={
                      showCurrent ? 'iconamoon:eye-off' : 'solar:eye-linear'
                    }
                    size={20}
                    className='text-neutral-950'
                  />
                </button>
                {currentError ? (
                  <div className='mt-xxs text-sm text-primary'>
                    {currentError}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <div className='relative'>
                <Input
                  type={showNew ? 'text' : 'password'}
                  placeholder=' '
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='peer placeholder-transparent pt-5 pr-10'
                  variant={newError ? 'error' : 'default'}
                />
                <span className='absolute left-md top-1 text-xs text-neutral-950 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs'>
                  New Password
                </span>
                <button
                  type='button'
                  className='absolute right-md top-1/2 -translate-y-1/2 text-neutral-500'
                  onClick={() => setShowNew((s) => !s)}
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  <Icon
                    name={showNew ? 'iconamoon:eye-off' : 'solar:eye-linear'}
                    size={20}
                    className='text-neutral-950'
                  />
                </button>
                {newError ? (
                  <div className='mt-xxs text-sm text-primary'>{newError}</div>
                ) : null}
              </div>
            </div>
            {formError ? (
              <div className='text-sm text-primary'>{formError}</div>
            ) : null}
            <div className='flex items-center justify-end gap-md'>
              <DialogClose asChild>
                <Button variant='neutral'>Cancel</Button>
              </DialogClose>
              <Button
                variant='primary'
                onClick={onSave}
                disabled={
                  updateProfile.isPending ||
                  (nameInput.trim() === origName &&
                    phoneInput.trim() === origPhone &&
                    currentPassword.length === 0 &&
                    newPassword.length === 0)
                }
              >
                {updateProfile.isPending ? (
                  <span className='inline-flex items-center gap-xxs'>
                    <Spinner size={18} />
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
