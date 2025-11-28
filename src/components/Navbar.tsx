import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { Dialog, DialogContent, DialogClose } from '../ui/dialog';
import SidebarProfile from './SidebarProfile';
import { setToken, setUserId } from '../features/auth/slice';
import { useQueryClient } from '@tanstack/react-query';
import { clear as clearCart } from '../features/cart/slice';

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

  const isAtTop = mode ? mode === 'top' : atTop;

  const { data: cart } = useCartQuery(userId, isLoggedIn);
  const { data: profile } = useProfileQuery(isLoggedIn);

  const cartCount =
    typeof cartCountOverride === 'number'
      ? cartCountOverride
      : cart?.data?.summary?.totalItems ?? 0;
  const displayName = profile?.data?.name ?? 'John Doe';

  const base = 'fixed top-0 left-0 right-0 z-50 transition-colors';
  const navClass = cn(
    base,
    isAtTop
      ? 'bg-transparent text-white'
      : 'bg-white text-neutral-900 border-b border-neutral-200 shadow-sm'
  );
  const btnOutlineTop = 'border border-white text-white hover:bg-white/10';
  const btnSolidTop = 'bg-white text-neutral-900 hover:opacity-95';

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const [profileOpen, setProfileOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const [navHeight, setNavHeight] = useState<number>(() =>
    typeof window !== 'undefined' && window.innerWidth >= 768 ? 64 : 56
  );
  useEffect(() => {
    const onResize = () => setNavHeight(window.innerWidth >= 768 ? 64 : 56);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return (
    <nav className={navClass} ref={navRef}>
      <Container className='flex items-center justify-between py-sm md:py-md'>
        <Link to='/' className='inline-flex items-center gap-sm' onClick={(e) => {
          if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
        }}>
          <span
            aria-label='Foody logo'
            className={cn(
              'inline-block h-8 w-8 md:h-6 md:w-6',
              isAtTop ? 'bg-white' : 'bg-primary'
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
              'font-extrabold md:text-display-md hidden md:inline',
              isAtTop ? 'text-white' : 'text-neutral-900'
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
                className={isAtTop ? 'text-white cursor-pointer' : 'text-black cursor-pointer'}
                size={isAtTop ? 28 : 26}
              />
              {cartCount > 0 ? (
                <span className='absolute -top-1 -right-1 size-4.5 rounded-full bg-primary px-xxs text-sm leading-5 text-white text-center'>
                  {cartCount}
                </span>
              ) : null}
            </IconButton>
            <button
              type='button'
              className='inline-flex items-center gap-sm cursor-pointer'
              onClick={() => setProfileOpen(true)}
            >
              <img
                src={avatarImg}
                alt={displayName}
                className='h-8 w-8 rounded-full'
              />
              <span className='text-lg font-medium hidden md:inline'>{displayName}</span>
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-sm'>
            <Button
              variant={isAtTop ? 'ghost' : 'outline'}
              className={isAtTop ? btnOutlineTop : undefined}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant={isAtTop ? 'neutral' : 'primary'}
              className={isAtTop ? btnSolidTop : undefined}
              onClick={() => navigate('/login?tab=signup')}
            >
              Sign Up
            </Button>
          </div>
        )}
      </Container>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent side='right' offsetTop={navHeight}>
          <SidebarProfile
            name={displayName}
            onProfile={() => {
              setProfileOpen(false);
              navigate('/profile');
            }}
            onDeliveryAddress={() => {
              setProfileOpen(false);
              navigate('/address');
            }}
            onMyOrders={() => {
              setProfileOpen(false);
              navigate('/orders');
            }}
            onLogout={() => {
              setProfileOpen(false);
              try {
                sessionStorage.removeItem('auth');
              } catch {
                void 0;
              }
              try {
                localStorage.removeItem('auth');
              } catch {
                void 0;
              }
              dispatch(setToken(null));
              dispatch(setUserId(null));
              dispatch(clearCart());
              qc.clear();
              navigate('/login');
            }}
          />
          <div className='mt-xl text-right'>
            <DialogClose asChild>
              <Button variant='neutral'>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
