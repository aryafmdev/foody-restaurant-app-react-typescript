import { Card, CardContent, CardHeader } from '../ui/card';
import { Icon } from '../ui/icon';
import { IconButton } from '../ui/icon-button';
import { DialogClose } from '../ui/dialog';
import avatarImg from '../assets/images/avatar.png';
import arrowLeft from '../assets/icons/arrow-circle-broken-left.png';

type SidebarProfileProps = {
  name: string;
  onProfile?: () => void;
  onDeliveryAddress?: () => void;
  onMyOrders?: () => void;
  onMyReviews?: () => void;
  onLogout?: () => void;
  className?: string;
  insideDialog?: boolean;
};

export default function SidebarProfile({
  name,
  onProfile,
  onDeliveryAddress,
  onMyOrders,
  onMyReviews,
  onLogout,
  className,
  insideDialog = true,
}: SidebarProfileProps) {
  return (
    <Card
      className={[
        'rounded-lg shadow-md p-2xl border border-neutral-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CardHeader className='border-none mb-2xl'>
        <div className='flex items-center justify-between gap-md'>
          <img
            src={avatarImg}
            alt={name}
            className='h-12 w-12 rounded-full object-cover'
          />
          <div className='flex-1 text-lg font-bold text-neutral-950'>
            {name}
          </div>
          {insideDialog ? (
            <DialogClose asChild>
              <IconButton
                aria-label='Close'
                size='sm'
                variant='neutral'
                className='rounded-full cursor-pointer'
              >
                <Icon
                  name='iconamoon:close'
                  size={20}
                  className='text-neutral-900 cursor-pointer'
                />
              </IconButton>
            </DialogClose>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className='p-2xl pt-none'>
        <div className='border-t border-neutral-300' />
        <div className='mt-4xl space-y-5xl'>
          <button
            type='button'
            className='w-full inline-flex items-center gap-md cursor-pointer'
            onClick={onProfile}
          >
            <Icon
              name='mdi:account-outline'
              size={24}
              className='text-neutral-900 cursor-pointer'
            />
            <span className='text-md font-medium text-neutral-900 cursor-pointer'>
              Profile
            </span>
          </button>
          <button
            type='button'
            className='w-full inline-flex items-center gap-md'
            onClick={onDeliveryAddress}
          >
            <Icon
              name='mdi:map-marker-outline'
              size={24}
              className='text-neutral-900 cursor-pointer'
            />
            <span className='text-md font-medium text-neutral-900 cursor-pointer'>
              Delivery Address
            </span>
          </button>
          <button
            type='button'
            className='w-full inline-flex items-center gap-md cursor-pointer'
            onClick={onMyOrders}
          >
            <Icon
              name='akar-icons:file'
              size={24}
              className='text-neutral-900 cursor-pointer'
            />
            <span className='text-md font-medium text-neutral-900 cursor-pointer'>
              My Orders
            </span>
          </button>
          <button
            type='button'
            className='w-full inline-flex items-center gap-md cursor-pointer'
            onClick={onMyReviews}
          >
            <Icon name='carbon:review' size={24} className='text-neutral-900' />
            <span className='text-md font-medium text-neutral-900 cursor-pointer'>
              My Reviews
            </span>
          </button>
          <button
            type='button'
            className='w-full inline-flex items-center gap-md cursor-pointer'
            onClick={onLogout}
          >
            <img src={arrowLeft} alt='Logout' className='h-6 w-6' />
            <span className='text-md font-medium text-neutral-900 cursor-pointer'>
              Logout
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
