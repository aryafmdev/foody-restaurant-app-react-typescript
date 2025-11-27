import type { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { Container } from '../ui/container';
import { Icon } from '../ui/icon';
import FooterLinkColumn from './FooterLinkColumn';

export default function Footer() {
  const location = useLocation();
  return (
    <footer className='bg-neutral-950 text-white py-6xl'>
      <Container className='py-2xl'>
        <div className='grid md:grid-cols-3 gap-y-2xl md:items-start'>
          <div className='space-y-2xl md:justify-self-start'>
            <Link to='/' className='inline-flex items-center gap-sm' onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }
            }}>
              <span
                aria-label='Foody logo'
                className='inline-block h-8 w-8 bg-primary'
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
              <span className='font-extrabold text-white text-display-md'>Foody</span>
            </Link>
            <p className='text-md text-neutral-300'>
              Enjoy homemade flavors & chef's signature dishes, freshly prepared
              every day. Order online or visit our nearest branch.
            </p>

            <div className='text-md font-extrabold'>Follow on Social Media</div>
            <div className='flex items-center gap-md'>
              <a
                href='#'
                aria-label='Facebook'
                className='inline-flex items-center justify-center h-10 w-10 rounded-full border border-neutral-700 hover:bg-white/10'
              >
                <Icon
                  name='ri:facebook-fill'
                  size={20}
                  className='text-white'
                />
              </a>
              <a
                href='#'
                aria-label='Instagram'
                className='inline-flex items-center justify-center h-10 w-10 rounded-full border border-neutral-700 hover:bg-white/10'
              >
                <Icon name='mdi:instagram' size={20} className='text-white' />
              </a>
              <a
                href='#'
                aria-label='LinkedIn'
                className='inline-flex items-center justify-center h-10 w-10 rounded-full border border-neutral-700 hover:bg-white/10'
              >
                <Icon
                  name='ri:linkedin-fill'
                  size={20}
                  className='text-white'
                />
              </a>
              <a
                href='#'
                aria-label='TikTok'
                className='inline-flex items-center justify-center h-10 w-10 rounded-full border border-neutral-700 hover:bg-white/10'
              >
                <Icon
                  name='ic:baseline-tiktok'
                  size={20}
                  className='text-white'
                />
              </a>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-x-2xl gap-y-2xl md:hidden'>
            <FooterLinkColumn
              title='Explore'
              links={[
                { label: 'All Food', href: '#' },
                { label: 'Nearby', href: '#' },
                { label: 'Discount', href: '#' },
                { label: 'Best Seller', href: '#' },
                { label: 'Delivery', href: '#' },
                { label: 'Lunch', href: '#' },
              ]}
            />
            <FooterLinkColumn
              title='Help'
              links={[
                { label: 'How to Order', href: '#' },
                { label: 'Payment Methods', href: '#' },
                { label: 'Track My Order', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Contact Us', href: '#' },
              ]}
            />
          </div>

          <div className='hidden md:block md:justify-self-center'>
            <FooterLinkColumn
              title='Explore'
              links={[
                { label: 'All Food', href: '#' },
                { label: 'Nearby', href: '#' },
                { label: 'Discount', href: '#' },
                { label: 'Best Seller', href: '#' },
                { label: 'Delivery', href: '#' },
                { label: 'Lunch', href: '#' },
              ]}
            />
          </div>
          <div className='hidden md:block md:justify-self-end'>
            <FooterLinkColumn
              title='Help'
              links={[
                { label: 'How to Order', href: '#' },
                { label: 'Payment Methods', href: '#' },
                { label: 'Track My Order', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Contact Us', href: '#' },
              ]}
            />
          </div>
        </div>
      </Container>
    </footer>
  );
}
