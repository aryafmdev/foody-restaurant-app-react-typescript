import { Card, CardContent, CardHeader } from '../ui/card';
import { Avatar } from '../ui/avatar';
import RatingGroup from './RatingGroup';
import avatarDefault from '../assets/images/avatar.png';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

type ReviewCardProps = {
  name: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date?: string | Date;
  className?: string;
};

export default function ReviewCard({
  name,
  avatarUrl,
  rating,
  comment,
  date,
  className,
}: ReviewCardProps) {
  const dateText = date
    ? dayjs(date).locale('id').format('D MMMM YYYY, HH:mm')
    : undefined;
  return (
    <Card
      className={[
        'rounded-lg shadow-md md:shadow-lg border-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CardHeader className='border-b-0 p-lg md:p-2xl'>
        <div className='flex items-center gap-sm md:gap-md'>
          <Avatar
            name={name}
            src={avatarUrl || avatarDefault}
            size='md'
            className='md:h-14 md:w-14'
          />
          <div>
            <div className='font-bold text-md md:text-lg text-neutral-900'>
              {name}
            </div>
            {dateText ? (
              <div className='mt-xxs text-xs md:text-sm text-neutral-700'>
                {dateText}
              </div>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-lg pt-none space-y-md'>
        <RatingGroup rating={rating} color='accent-yellow' />
        <p className='text-sm md:text-md text-neutral-900'>{comment}</p>
      </CardContent>
    </Card>
  );
}
