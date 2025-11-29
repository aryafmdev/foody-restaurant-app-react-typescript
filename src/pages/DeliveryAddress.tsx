import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/container';
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
    <Container className='py-3xl'>
      <div className='text-display-md font-extrabold text-neutral-950'>
        Delivery Address
      </div>

      <div className='mt-2xl'>
        <DeliveryAddressCard
          className='mt-xs'
          address={'Jl. Sudirman No. 10, Jakarta'}
          phone={profile?.data?.phone ?? '08xx-xxxx-xxxx'}
          changeLabel='Change'
          onChange={() => navigate('/profile')}
        />
      </div>
    </Container>
  );
}
