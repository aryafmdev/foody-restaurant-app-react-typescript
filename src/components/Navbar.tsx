import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import logo from '../assets/images/logo.png';
import avatarImg from '../assets/images/avatar.png';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Container } from '../ui/container';
import { Icon } from '../ui/icon';
import { useCartQuery } from '../services/queries/cart';
import { useProfileQuery } from '../services/queries/auth';
import { cn } from '../lib/cn';

type NavbarProps = {
  mode?: 'top' | 'scrolled';
  loggedIn?: boolean;
  cartCountOverride?: number;
};

export default function Navbar({
  mode,
  loggedIn,
  cartCountOverride,
}: NavbarProps) {
  const token = useSelector((s: RootState) => s.auth.token);
  const userId = useSelector((s: RootState) => s.auth.userId);
  const isLoggedIn = typeof loggedIn === 'boolean' ? loggedIn : !!token;
  const [atTop, setAtTop] = useState<boolean>(mode ? mode === 'top' : true);

  useEffect(() => {
    if (mode) return;
    const onScroll = () => setAtTop(window.scrollY < 10);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [mode]);

  const { data: cart } = useCartQuery(userId, isLoggedIn);
  const { data: profile } = useProfileQuery(isLoggedIn);

  const cartCount =
    typeof cartCountOverride === 'number'
      ? cartCountOverride
      : cart?.data?.summary?.totalItems ?? 0;
  const displayName = profile?.data?.name ?? 'John Doe';

  const navClass = atTop
    ? 'bg-transparent text-white'
    : 'bg-white text-neutral-900 border border-neutral-200 shadow-sm';
  const btnOutlineTop = 'border border-white text-white hover:bg-white/10';
  const btnSolidTop = 'bg-white text-neutral-900 hover:opacity-95';

  const navigate = useNavigate();

  return (
    <nav className={navClass}>
      <Container className='flex items-center justify-between py-sm md:py-md'>
        <Link to='/' className='inline-flex items-center gap-sm'>
          <span
            aria-label='Foody logo'
            className={cn(
              'inline-block h-8 w-8 md:h-6 md:w-6',
              atTop ? 'bg-white' : 'bg-primary'
            )}
            style={
              {
                WebkitMaskImage: `url(${logo})`,
                maskImage: `url(${logo})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              } as CSSProperties
            }
          />
          <span
            className={cn(
              'font-extrabold hidden md:inline',
              atTop ? 'text-white' : 'text-neutral-900'
            )}
          >
            Foody
          </span>
        </Link>

        {isLoggedIn ? (
          <div className='flex items-center gap-sm md:gap-md'>
            <IconButton
              aria-label='Cart'
              variant='bare'
              size='none'
              onClick={() => navigate('/cart')}
              className='relative'
            >
              <Icon
                name='lets-icons:bag-fill'
                className={atTop ? 'text-white' : 'text-black'}
                size={atTop ? 28 : 26}
              />
              {cartCount > 0 ? (
                <span className='absolute -top-1 -right-1 size-4.5 rounded-full bg-primary px-xxs text-sm leading-5 text-white text-center'>
                  {cartCount}
                </span>
              ) : null}
            </IconButton>
            <div className='inline-flex items-center gap-sm'>
              <img
                src={avatarImg}
                alt={displayName}
                className='h-8 w-8 rounded-full'
              />
              <span className='text-sm font-medium'>{displayName}</span>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-sm'>
            <Button
              variant={atTop ? 'ghost' : 'outline'}
              className={atTop ? btnOutlineTop : undefined}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant={atTop ? 'neutral' : 'primary'}
              className={atTop ? btnSolidTop : undefined}
              onClick={() => navigate('/login?tab=signup')}
            >
              Sign Up
            </Button>
          </div>
        )}
      </Container>
    </nav>
  );
}
