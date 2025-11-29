import { Link, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';

import { Container } from '../ui/container';
import { Alert, Skeleton, Button } from '../ui';
import { Icon } from '../ui/icon';
import { IconButton } from '../ui/icon-button';
import { RestaurantInfoCard } from '../components';
import RestaurantFilterDialog, {
  type RestaurantFilters,
} from '../components/RestaurantFilterDialog';
import { useAllRestaurantsQuery } from '../services/queries/restaurants';
import { computeDistanceKm } from '../lib/format';
import type {
  RestaurantListItem,
  RestaurantListResponse,
} from '../types/schemas';

export default function Restaurants() {
  const { data, isLoading, isError } = useAllRestaurantsQuery();
  const [open, setOpen] = useState(false);
  const [sp] = useSearchParams();
  const initialDistance = (() => {
    const d = sp.get('distance');
    const allowed = ['nearby', '1km', '3km', '5km'];
    return allowed.includes(String(d)) ? (d as RestaurantFilters['distance']) : undefined;
  })();
  const initialRatings = (() => {
    const r = sp.get('ratings');
    if (!r) return [] as number[];
    const arr = String(r)
      .split(',')
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);
    return arr;
  })();
  const [filters, setFilters] = useState<RestaurantFilters>({ ratings: initialRatings, distance: initialDistance });
  const rawList = useMemo(
    () =>
      ((data as RestaurantListResponse | undefined)?.data?.restaurants ??
        []) as RestaurantListItem[],
    [data]
  );
  const withDist = useMemo(() => {
    const FALLBACK_LAT = -6.175392;
    const FALLBACK_LONG = 106.827153;
    return rawList.map((r) => {
      const coords = r.coordinates;
      const lat = coords?.lat ?? r.lat;
      const long = coords?.long ?? r.long;
      const fallbackDistFor = (idOrName: number | string | undefined) => {
        const key =
          typeof idOrName === 'number' ? idOrName : String(idOrName ?? 'x');
        const buckets = [0.8, 1.2, 2.1, 2.8, 3.6, 4.7, 5.3];
        const idx =
          typeof key === 'number'
            ? key % buckets.length
            : Array.from(String(key)).reduce(
                (a, c) => (a * 31 + c.charCodeAt(0)) % buckets.length,
                0
              );
        return buckets[idx];
      };
      const hasBackendDistance =
        typeof r.distance === 'number' &&
        isFinite(r.distance) &&
        r.distance >= 0;
      const hasCoords =
        typeof lat === 'number' &&
        isFinite(lat!) &&
        typeof long === 'number' &&
        isFinite(long!);
      const dist = hasBackendDistance
        ? (r.distance as number)
        : hasCoords
        ? computeDistanceKm(
            FALLBACK_LAT,
            FALLBACK_LONG,
            lat as number,
            long as number
          )
        : fallbackDistFor(r.id ?? r.name);
      return { r, dist };
    });
  }, [rawList]);
  const filteredList = useMemo(() => {
    const inDistance = (
      dist: number | undefined,
      f: RestaurantFilters['distance']
    ) => {
      if (!f) return true;
      if (dist == null || !isFinite(dist)) return false;
      if (f === 'nearby') return dist < 1;
      if (f === '1km') return dist >= 1 && dist < 3;
      if (f === '3km') return dist >= 3 && dist < 5;
      if (f === '5km') return dist >= 5;
      return true;
    };
    const inPrice = (
      pr: { min: number; max: number } | undefined,
      min?: number,
      max?: number
    ) => {
      if (min == null && max == null) return true;
      if (!pr) return false;
      const overlapMin = min == null || pr.max >= min;
      const overlapMax = max == null || pr.min <= max;
      return overlapMin && overlapMax;
    };
    const inRating = (
      star: number | undefined,
      selected: number[] | undefined
    ) => {
      const sels = selected ?? [];
      if (sels.length === 0) return true;
      const bucket = Math.round(star ?? 0);
      return sels.includes(bucket);
    };
    return withDist.filter(({ r, dist }) => {
      const okDist = inDistance(dist, filters.distance);
      const okPrice = inPrice(r.priceRange, filters.priceMin, filters.priceMax);
      const okRating = inRating(r.star, filters.ratings);
      return okDist && okPrice && okRating;
    });
  }, [withDist, filters]);
  return (
    <div className='bg-white'>
      <Container className='py-2xl'>
        <div className='flex items-center justify-between'>
          <div className='text-display-sm font-extrabold text-neutral-950'>
            All Restaurants
          </div>
          <Link to='/' className='block'>
            <Button variant='primary' size='sm' className='rounded-full px-xl'>
              Home
            </Button>
          </Link>
        </div>

        <div className='mt-xl border border-neutral-100 p-sm rounded-sm flex items-center justify-between'>
          <div className='text-sm font-extrabold text-neutral-950'>FILTER</div>
          <RestaurantFilterDialog
            open={open}
            onOpenChange={setOpen}
            filters={filters}
            onFiltersChange={setFilters}
          >
            <IconButton
              aria-label='Open Filter'
              size='sm'
              variant='ghost'
              className='rounded-full cursor-pointer'
            >
              <Icon
                name='streamline-ultimate:filter-sort-lines-descending-bold'
                size={20}
                className='text-neutral-900 cursor-pointer'
              />
            </IconButton>
          </RestaurantFilterDialog>
        </div>
        {isError ? (
          <div className='mt-xl'>
            <Alert variant='error'>Failed to load restaurants</Alert>
          </div>
        ) : (
          <>
            <div className='mt-xl grid grid-cols-1 md:grid-cols-3 gap-2xl'>
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className='rounded-lg shadow-md md:shadow-lg border-none'
                    >
                      <div className='p-xl'>
                        <div className='flex items-center gap-md'>
                          <Skeleton className='h-16 w-16 md:h-20 md:w-20 rounded-lg' />
                          <div className='flex-1 h-16 md:h-20 flex flex-col justify-between'>
                            <Skeleton className='h-4 w-3/4' />
                            <Skeleton className='h-4 w-1/3' />
                            <Skeleton className='h-4 w-2/3' />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : filteredList.map(({ r, dist }) => (
                    <Link
                      key={r.id}
                      to={`/restaurant/${r.id}`}
                      className='block'
                    >
                      <RecCardAll r={r} distanceKm={dist} />
                    </Link>
                  ))}
            </div>
            <div className='mt-2xl flex justify-center'>
              <Button
                variant='neutral'
                size='sm'
                className='rounded-full px-xl'
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

function RecCardAll({
  r,
  distanceKm,
}: {
  r: RestaurantListItem;
  distanceKm?: number;
}) {
  const FALLBACK_LAT = -6.175392;
  const FALLBACK_LONG = 106.827153;
  const anyR = r as RestaurantListItem;
  const coords = anyR.coordinates;
  const lat = coords?.lat ?? anyR.lat;
  const long = coords?.long ?? anyR.long;
  const useBackendDistance =
    typeof anyR.distance === 'number' &&
    isFinite(anyR.distance) &&
    anyR.distance >= 0;
  const hasCoords =
    typeof lat === 'number' &&
    isFinite(lat!) &&
    typeof long === 'number' &&
    isFinite(long!);
  const d =
    distanceKm ??
    (useBackendDistance
      ? (anyR.distance as number)
      : hasCoords
      ? computeDistanceKm(
          FALLBACK_LAT,
          FALLBACK_LONG,
          lat as number,
          long as number
        )
      : undefined);
  return (
    <RestaurantInfoCard
      name={anyR.name}
      logo={anyR.logo}
      place={anyR.place}
      distanceKm={d}
      rating={anyR.star}
    />
  );
}
