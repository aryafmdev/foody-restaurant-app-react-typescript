import { Card, CardContent } from '../ui/card';
import { Image } from '../ui/image';
import { Icon } from '../ui/icon';
import burgerKing from '../assets/images/burger-king.png';

type RestaurantInfoCardProps = {
  name: string;
  logo?: string;
  place?: string;
  distanceKm?: number;
  rating?: number;
};

export default function RestaurantInfoCard({
  name,
  logo,
  place,
  distanceKm,
  rating = 0,
}: RestaurantInfoCardProps) {
  const imgSrc = logo || burgerKing;
  return (
    <Card className='rounded-lg shadow-md md:shadow-lg border-none'>
      <CardContent className='p-xl'>
        <div className='flex items-center gap-md'>
          <div className='h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden bg-neutral-200'>
            <Image alt={name} src={imgSrc} className='h-full w-full' />
          </div>
          <div className='flex-1 h-16 md:h-20 flex flex-col justify-between'>
            <div className='text-md md:text-lg font-extrabold text-neutral-900'>
              {name}
            </div>
            <div className='inline-flex items-center gap-xxs'>
              <Icon
                name='material-symbols:star-rounded'
                size={18}
                className='text-accent-yellow'
              />
              <span className='text-sm md:text-md text-neutral-900'>
                {rating.toFixed(1)}
              </span>
            </div>
            <div className='text-sm md:text-md text-neutral-700'>
              {[
                place,
                typeof distanceKm === 'number' ? `${distanceKm} km` : undefined,
              ]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
