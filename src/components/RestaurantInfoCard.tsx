import { Card, CardContent } from '../ui/card';
import { Image } from '../ui/image';
import { Icon } from '../ui/icon';
import fallbackImg from '../assets/images/fallback-image.png';
import { formatPlaceAndDistance } from '../lib/format';

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
  const imgSrc = logo || fallbackImg;
  return (
    <Card className='rounded-lg border-none'>
      <CardContent className='p-lg w-full'>
        <div className='flex items-center gap-md h-full'>
          <div className='h-[clamp(90px,6.25vw,120px)] w-[clamp(90px,6.25vw,120px)] rounded-lg overflow-hidden bg-neutral-200 shrink-0'>
            <Image
              alt={name}
              src={imgSrc}
              fallbackSrc={fallbackImg}
              className='size-full object-cover'
            />
          </div>
          <div className='flex-1 min-w-0 flex flex-col gap-xxs'>
            <div
              className='text-[clamp(1rem,1.25vw,1.125rem)] font-extrabold text-neutral-950 break-words'
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {name}
            </div>
            <div className='inline-flex items-center gap-xxs flex-wrap'>
              <Icon
                name='material-symbols:star-rounded'
                size={18}
                className='text-accent-yellow'
              />
              <span className='text-sm md:text-md text-neutral-950'>
                {rating.toFixed(1)}
              </span>
            </div>
            <div className='text-[clamp(0.875rem,1.11vw,1rem)] md:text-md text-neutral-950 break-words'>
              {formatPlaceAndDistance(place ?? 'Jakarta Pusat', distanceKm)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
