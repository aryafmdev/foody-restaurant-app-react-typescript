import type { ReactNode } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogPortal,
} from '../ui/dialog';
import { Icon } from '../ui/icon';
import { IconButton } from '../ui/icon-button';
import { Divider } from '../ui/divider';
import { Checkbox, CheckboxLabel } from '../ui/checkbox';
import { Input } from '../ui/input';

export type RestaurantFilters = {
  distance?: 'nearby' | '1km' | '3km' | '5km';
  priceMin?: number;
  priceMax?: number;
  ratings?: number[];
};

type RestaurantFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: RestaurantFilters;
  onFiltersChange: (next: RestaurantFilters) => void;
  children: ReactNode;
};

export default function RestaurantFilterDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  children,
}: RestaurantFilterDialogProps) {
  const d = filters.distance;
  const ratings = filters.ratings ?? [];
  const toggleDistance = (val: 'nearby' | '1km' | '3km' | '5km') => {
    const next = d === val ? undefined : val;
    onFiltersChange({ ...filters, distance: next });
  };
  const toggleRating = (val: number) => {
    const exists = ratings.includes(val);
    const next = exists ? ratings.filter((x) => x !== val) : [...ratings, val];
    onFiltersChange({ ...filters, ratings: next });
  };
  const onMinChange = (v: string) => {
    const num = v.trim() ? Number(v) : undefined;
    onFiltersChange({ ...filters, priceMin: num });
  };
  const onMaxChange = (v: string) => {
    const num = v.trim() ? Number(v) : undefined;
    onFiltersChange({ ...filters, priceMax: num });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent side='right' className='h-screen w-[84vw] mr-7xl'>
        <div className='flex items-center justify-between gap-md'>
          <div className='text-lg font-extrabold text-neutral-950'>FILTER</div>
        </div>

        <div className='mt-2xl'>
          <div className='text-md font-extrabold text-neutral-950'>
            Distance
          </div>
          <div className='mt-md space-y-2xl'>
            <label className='flex items-center'>
              <Checkbox
                checked={d === 'nearby'}
                onChange={() => toggleDistance('nearby')}
              />
              <CheckboxLabel>Nearby</CheckboxLabel>
            </label>
            <label className='flex items-center'>
              <Checkbox
                checked={d === '1km'}
                onChange={() => toggleDistance('1km')}
              />
              <CheckboxLabel>Within 1 km</CheckboxLabel>
            </label>
            <label className='flex items-center'>
              <Checkbox
                checked={d === '3km'}
                onChange={() => toggleDistance('3km')}
              />
              <CheckboxLabel>Within 3 km</CheckboxLabel>
            </label>
            <label className='flex items-center'>
              <Checkbox
                checked={d === '5km'}
                onChange={() => toggleDistance('5km')}
              />
              <CheckboxLabel>Within 5 km</CheckboxLabel>
            </label>
          </div>
          <Divider className='mt-xl' />

          <div className='mt-xl'>
            <div className='text-md font-extrabold text-neutral-950'>Price</div>
            <div className='mt-md space-y-md'>
              <div className='relative w-full'>
                <span className='absolute left-2xl top-1/2 -translate-y-1/2 text-neutral-700'>
                  Rp
                </span>
                <Input
                  placeholder='Minimum Price'
                  uiSize='md'
                  className='pl-10'
                  value={filters.priceMin ?? ''}
                  onChange={(e) => onMinChange(e.target.value)}
                />
              </div>
              <div className='relative w-full'>
                <span className='absolute left-2xl top-1/2 -translate-y-1/2 text-neutral-700'>
                  Rp
                </span>
                <Input
                  placeholder='Maximum Price'
                  uiSize='md'
                  className='pl-10'
                  value={filters.priceMax ?? ''}
                  onChange={(e) => onMaxChange(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Divider className='mt-xl' />

          <div className='mt-xl'>
            <div className='text-md font-extrabold text-neutral-950'>
              Rating
            </div>
            <div className='mt-md space-y-2xl'>
              {[5, 4, 3, 2, 1].map((r) => (
                <label key={r} className='flex items-center'>
                  <Checkbox
                    checked={ratings.includes(r)}
                    onChange={() => toggleRating(r)}
                  />
                  <CheckboxLabel className='inline-flex items-center gap-xxs'>
                    <Icon
                      name='material-symbols:star-rounded'
                      size={18}
                      className='text-yellow-500'
                    />
                    {r}
                  </CheckboxLabel>
                </label>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogPortal>
        <DialogClose asChild>
          <IconButton
            aria-label='Close'
            size='sm'
            variant='neutral'
            className='fixed right-2xl top-2xl rounded-full cursor-pointer z-[62]'
          >
            <Icon
              name='iconamoon:close'
              size={20}
              className='text-neutral-900 cursor-pointer'
            />
          </IconButton>
        </DialogClose>
      </DialogPortal>
    </Dialog>
  );
}
