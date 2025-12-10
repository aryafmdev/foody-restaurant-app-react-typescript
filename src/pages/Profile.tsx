import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { Container } from '../ui/container';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { SidebarProfile } from '../components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
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

export default function Profile() {
  const navigate = useNavigate();
  const token = useSelector((s: RootState) => s.auth.token);
  const isLoggedIn = !!token;
  const { data: profile, isLoading, error } = useProfileQuery(isLoggedIn);
  const user = profile?.data;

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
  const [formError, setFormError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
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
  const showToast = (type: 'success' | 'error', msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  };

  const onSave = async () => {
    setFormError('');
    setNameError('');
    setPhoneError('');
    setCurrentError('');
    setNewError('');
    const n = nameInput.trim();
    const p = phoneInput.trim();
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
        phone: p,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      const changedPwd = !!(currentPassword || newPassword);
      const changedProfile = n !== origName || p !== origPhone;
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
                        src={avatarImg}
                        alt={displayName}
                        className='h-12 w-12 rounded-full object-cover'
                      />
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
                          setNameInput(n0);
                          setPhoneInput(p0);
                          setOrigName(n0);
                          setOrigPhone(p0);
                          setFormError('');
                          setNameError('');
                          setPhoneError('');
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
            Change your name and phone number
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
