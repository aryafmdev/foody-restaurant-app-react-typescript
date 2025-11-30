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
    <button type='button' onClick={onClick} className='w-full cursor-pointer'>
      <div className='flex flex-col items-center'>
        <Card className='rounded-lg border-none bg-white h-[100px] w-[clamp(106px,11.2vw,161px)]'>
          <CardContent className='p-none h-full'>
            <div className='h-full w-full flex items-center justify-center'>
              <Image alt={label} src={image} className='size-[clamp(48px,4.51vw,65px)] border-none bg-transparent object-contain' />
            </div>
          </CardContent>
        </Card>
        <div className='mt-xs text-sm md:text-md font-bold text-neutral-950'>{label}</div>
      </div>
    </button>
  );
}
