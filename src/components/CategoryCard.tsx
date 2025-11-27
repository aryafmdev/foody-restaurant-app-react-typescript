import { Card, CardContent } from '../ui/card';
import { Image } from '../ui/image';

type CategoryCardProps = {
  label: string;
  image: string;
  onClick?: () => void;
};

export default function CategoryCard({
  label,
  image,
  onClick,
}: CategoryCardProps) {
  return (
    <button type='button' onClick={onClick} className='w-full'>
      <div className='flex flex-col items-center'>
        <Card className='rounded-2xl shadow-md border-none bg-white'>
          <CardContent className='p-xl'>
            <div className='flex items-center justify-center'>
              <div className='h-12 w-12 rounded-lg overflow-hidden bg-neutral-100'>
                <Image
                  alt={label}
                  src={image}
                  className='h-full w-full object-contain'
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='mt-xs text-sm text-neutral-900'>{label}</div>
      </div>
    </button>
  );
}
