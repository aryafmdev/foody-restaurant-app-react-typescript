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

export default function Profile() {
  const navigate = useNavigate();
  const token = useSelector((s: RootState) => s.auth.token);
  const isLoggedIn = !!token;
  const { data: profile, isLoading } = useProfileQuery(isLoggedIn);
  const user = profile?.data;

  useEffect(() => {
    if (!isLoggedIn) navigate('/login?tab=signin');
  }, [isLoggedIn, navigate]);

  const displayName = useMemo(() => user?.name ?? 'John Doe', [user]);
  const email = user?.email ?? 'user@example.com';
  const phone = user?.phone ?? '081234567890';

  const updateProfile = useUpdateProfileMutation();
  const [open, setOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [formError, setFormError] = useState('');

  // Prepare form values when opening the dialog via button handler

  const onSave = async () => {
    setFormError('');
    const n = nameInput.trim();
    const p = phoneInput.trim();
    if (n.length < 2) {
      setFormError('Name must be at least 2 characters');
      return;
    }
    if (!/^\d{10,13}$/.test(p)) {
      setFormError('Phone must be 10–13 digits');
      return;
    }
    try {
      await updateProfile.mutateAsync({ name: n, phone: p });
      setOpen(false);
      // naive refresh: navigate to same route
      navigate('/profile');
    } catch (err: unknown) {
      const anyErr = err as { response?: { data?: { message?: string } } };
      setFormError(anyErr?.response?.data?.message ?? 'Update failed');
    }
  };

  return (
    <>
      <Container className='py-2xl'>
        <div className='md:grid md:grid-cols-3 gap-2xl'>
          <div className='hidden md:block'>
            <SidebarProfile
              name={displayName}
              onDeliveryAddress={() => navigate('/address')}
              onMyOrders={() => navigate('/orders')}
              onLogout={() => navigate('/login')}
            />
          </div>

          <div className='md:col-span-2'>
            <div className='text-display-md font-extrabold text-neutral-950'>
              Profile
            </div>

            <Card className='mt-xl rounded-lg shadow-md border border-neutral-200'>
              <CardContent className='p-2xl'>
                {isLoading ? (
                  <div className='text-md text-neutral-700'>Loading...</div>
                ) : (
                  <div className='space-y-2xl'>
                    <div className='inline-flex items-center gap-sm'>
                      <img
                        src={avatarImg}
                        alt={displayName}
                        className='h-12 w-12 rounded-full object-cover'
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='text-md text-neutral-900'>Name</div>
                      <div className='text-md font-semibold text-neutral-900'>
                        {displayName}
                      </div>

                      <div className='text-md text-neutral-900'>Email</div>
                      <div className='text-md font-semibold text-neutral-900'>
                        {email}
                      </div>

                      <div className='text-md text-neutral-900'>
                        Nomor Handphone
                      </div>
                      <div className='text-md font-semibold text-neutral-900'>
                        {phone}
                      </div>
                    </div>

                    <div>
                      <Button
                        className='w-full'
                        onClick={() => {
                          setNameInput(user?.name || '');
                          setPhoneInput(user?.phone || '');
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
                />
                <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs'>
                  Name
                </span>
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
                />
                <span className='absolute left-md top-1 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-md peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs'>
                  Number Phone
                </span>
              </div>
            </div>
            {formError ? (
              <div className='text-sm text-primary'>{formError}</div>
            ) : null}
            <div className='flex items-center justify-end gap-md'>
              <DialogClose asChild>
                <Button variant='neutral'>Cancel</Button>
              </DialogClose>
              <Button onClick={onSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
