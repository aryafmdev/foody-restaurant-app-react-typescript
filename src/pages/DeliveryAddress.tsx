import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/container';
import { SidebarProfile } from '../components';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { DeliveryAddressCard } from '../components';
import { useProfileQuery } from '../services/queries/auth';

export default function DeliveryAddress() {
  const token = useSelector((s: RootState) => s.auth.token);
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const { data: profile } = useProfileQuery(isLoggedIn);

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
            name={profile?.data?.name ?? 'User'}
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
              address={'Jl. Sudirman No. 10, Jakarta'}
              phone={profile?.data?.phone ?? '08xx-xxxx-xxxx'}
              changeLabel='Change'
              onChange={() => navigate('/profile')}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
