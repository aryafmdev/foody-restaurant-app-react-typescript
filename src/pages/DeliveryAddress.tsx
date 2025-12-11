import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/container';
import { SidebarProfile } from '../components';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { DeliveryAddressCard } from '../components';
import { useProfileQuery } from '../services/queries/auth';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { setUser } from '../features/auth/slice';
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function DeliveryAddress() {
  const token = useSelector((s: RootState) => s.auth.token);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const { data: profile } = useProfileQuery(isLoggedIn);
  const dispatch = useDispatch();
  const qc = useQueryClient();

  const displayName = useMemo(
    () => authUser?.name ?? profile?.data?.name ?? 'User',
    [authUser, profile]
  );
  const displayAvatar = useMemo(
    () => authUser?.avatar ?? profile?.data?.avatar ?? undefined,
    [authUser, profile]
  );
  const currentAddress = useMemo(
    () => authUser?.address ?? 'Jl. Sudirman No. 10, Jakarta',
    [authUser]
  );
  const currentLat = authUser?.latitude;
  const currentLong = authUser?.longitude;

  const [open, setOpen] = useState(false);
  const [addrInput, setAddrInput] = useState(currentAddress);
  const [latInput, setLatInput] = useState<string>(
    typeof currentLat === 'number' ? String(currentLat) : ''
  );
  const [longInput, setLongInput] = useState<string>(
    typeof currentLong === 'number' ? String(currentLong) : ''
  );
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const phoneDisplay =
    authUser?.phone ?? profile?.data?.phone ?? '08xx-xxxx-xxxx';

  if (!isLoggedIn)
    return (
      <Container className='py-2xl'>
        <Alert variant='warning'>
          Silakan login untuk melihat alamat pengantaran
        </Alert>
        <Button className='mt-md' onClick={() => navigate('/login')}>
          Login
        </Button>
      </Container>
    );

  return (
    <Container className='py-3xl max-w-[1200px]'>
      <div className='md:grid md:grid-cols-[240px_1fr] gap-3xl items-start  md:flex md:justify-center'>
        <div className='hidden md:block md:w-[240px]'>
          <SidebarProfile
            name={displayName}
            avatar={displayAvatar}
            onProfile={() => navigate('/profile')}
            onDeliveryAddress={() => navigate('/address')}
            onMyOrders={() => navigate('/orders')}
            onMyReviews={() => navigate('/my-reviews')}
            onLogout={() => navigate('/login')}
            insideDialog={false}
            className='w-full md:w-[240px]'
            activeItem='delivery_address'
          />
        </div>

        <div className='md:col-span-1'>
          <div className='text-display-md font-extrabold text-neutral-950'>
            Delivery Address
          </div>

          <div className='mt-5xl'>
            <DeliveryAddressCard
              className='mt-xs'
              address={currentAddress}
              phone={phoneDisplay}
              changeLabel='Change'
              onChange={() => {
                setFormError('');
                setAddrInput(currentAddress);
                setLatInput(
                  typeof currentLat === 'number' ? String(currentLat) : ''
                );
                setLongInput(
                  typeof currentLong === 'number' ? String(currentLong) : ''
                );
                setOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='rounded-lg p-xl w-[92%] max-w-[460px] mx-auto'>
          <DialogTitle className='text-display-lg font-extrabold text-neutral-950'>
            Ubah Alamat
          </DialogTitle>
          <DialogDescription>
            Ganti alamat dan koordinat lokasi Anda untuk akurasi jarak restoran
          </DialogDescription>
          <div className='mt-lg space-y-lg'>
            <div>
              <div className='text-sm text-neutral-900 mb-xxs'>Alamat</div>
              <Input
                value={addrInput}
                onChange={(e) => setAddrInput(e.target.value)}
                placeholder='Masukkan alamat lengkap'
              />
            </div>
            <div className='grid grid-cols-2 gap-md'>
              <div>
                <div className='text-sm text-neutral-900 mb-xxs'>Latitude</div>
                <Input
                  type='number'
                  step='any'
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  placeholder='-90 s/d 90'
                />
              </div>
              <div>
                <div className='text-sm text-neutral-900 mb-xxs'>Longitude</div>
                <Input
                  type='number'
                  step='any'
                  value={longInput}
                  onChange={(e) => setLongInput(e.target.value)}
                  placeholder='-180 s/d 180'
                />
              </div>
            </div>
            {formError ? (
              <div className='text-sm text-primary'>{formError}</div>
            ) : null}
            <div className='flex items-center justify-between gap-sm'>
              <Button
                variant='neutral'
                size='sm'
                className='rounded-full text-xs h-8 px-xl md:h-8 md:px-xl border border-neutral-300'
                onClick={() => {
                  if (!navigator.geolocation) {
                    setFormError('Geolocation tidak didukung browser Anda');
                    return;
                  }
                  setFormError('');
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const { latitude, longitude } = pos.coords;
                      setLatInput(String(latitude));
                      setLongInput(String(longitude));
                    },
                    () => setFormError('Gagal mengambil lokasi perangkat'),
                    { enableHighAccuracy: true, timeout: 5000 }
                  );
                }}
              >
                Use Location Device
              </Button>
              <div className='inline-flex items-center gap-sm'>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full h-8 px-xl md:h-8 md:px-xl'
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  size='sm'
                  className='rounded-full h-8 px-xl md:h-8 md:px-xl'
                  disabled={saving}
                  onClick={async () => {
                    setFormError('');
                    const lat = Number(latInput);
                    const long = Number(longInput);
                    const addr = addrInput.trim();
                    if (addr.length < 4) {
                      setFormError('Alamat minimal 4 karakter');
                      return;
                    }
                    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
                      setFormError('Latitude harus dalam rentang -90 s/d 90');
                      return;
                    }
                    if (!Number.isFinite(long) || long < -180 || long > 180) {
                      setFormError(
                        'Longitude harus dalam rentang -180 s/d 180'
                      );
                      return;
                    }
                    try {
                      setSaving(true);
                      const nextUser = {
                        id: authUser?.id ?? null,
                        name: authUser?.name ?? null,
                        email: authUser?.email ?? null,
                        phone: authUser?.phone ?? null,
                        avatar: authUser?.avatar ?? null,
                        address: addr,
                        latitude: lat,
                        longitude: long,
                      };
                      dispatch(setUser(nextUser));
                      try {
                        const storedRaw =
                          localStorage.getItem('auth') ??
                          sessionStorage.getItem('auth');
                        const stored = storedRaw ? JSON.parse(storedRaw) : {};
                        const tokenStored = stored?.token ?? token;
                        const userIdStored =
                          stored?.userId ??
                          (authUser?.id ? String(authUser.id) : null);
                        const payload = {
                          token: tokenStored,
                          userId: userIdStored,
                          user: {
                            ...stored?.user,
                            address: addr,
                            latitude: lat,
                            longitude: long,
                          },
                        };
                        if (localStorage.getItem('auth'))
                          localStorage.setItem('auth', JSON.stringify(payload));
                        else
                          sessionStorage.setItem(
                            'auth',
                            JSON.stringify(payload)
                          );
                      } catch {
                        void 0;
                      }
                      try {
                        qc.invalidateQueries({ queryKey: ['restaurants'] });
                        qc.invalidateQueries({
                          queryKey: ['restaurants', 'list'],
                        });
                        qc.invalidateQueries({
                          queryKey: ['restaurants', 'all'],
                        });
                        qc.invalidateQueries({
                          queryKey: ['restaurants', 'detail'],
                        });
                        qc.invalidateQueries({
                          queryKey: ['restaurants', 'recommended'],
                        });
                      } catch {
                        void 0;
                      }
                      setOpen(false);
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
