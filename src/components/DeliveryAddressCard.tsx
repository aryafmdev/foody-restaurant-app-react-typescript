import { Card, CardContent } from '../ui/card';
import nearbyImg from '../assets/images/nearby.png';
import { Button } from '../ui/button';
import { cn } from '../lib/cn';

type DeliveryAddressCardProps = {
  title?: string;
  address: string;
  phone?: string;
  changeLabel?: string;
  onChange?: () => void;
  className?: string;
};

export default function DeliveryAddressCard({
  title = 'Delivery Address',
  address,
  phone,
  changeLabel = 'Change',
  onChange,
  className,
}: DeliveryAddressCardProps) {
  return (
    <Card
      className={cn(
        'rounded-lg border-none bg-white',
        className
      )}
    >
      <CardContent className='p-2xl space-y-lg'>
        <div className='inline-flex items-center gap-sm'>
          <img src={nearbyImg} alt='Location' className='h-6 w-6' />
          <div className='text-md font-extrabold text-neutral-950'>{title}</div>
        </div>
        <div className='text-sm text-neutral-950'>{address}</div>
        {phone ? <div className='text-sm text-neutral-950'>{phone}</div> : null}
        <div>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full h-8 w-25 px-2xl'
            onClick={onChange}
          >
            {changeLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
