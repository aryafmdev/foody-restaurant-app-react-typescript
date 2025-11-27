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
        <Card className='rounded-lg border border-neutral-200 bg-white shadow-sm size-20 md:w-27'>
          <CardContent className='p-none h-full'>
            <div className='h-full w-full flex items-center justify-center'>
              <Image alt={label} src={image} className='size-12 border-none bg-transparent object-contain' />
            </div>
          </CardContent>
        </Card>
        <div className='mt-xs text-sm md:text-md font-bold text-neutral-950'>{label}</div>
      </div>
    </button>
  );
}
