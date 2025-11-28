import { Link } from 'react-router-dom';

import { Container } from '../ui/container';
import { Alert, Skeleton, Button } from '../ui';
import { RestaurantInfoCard } from '../components';
import {
  useAllRestaurantsQuery,
  useRestaurantDetailQuery,
} from '../services/queries/restaurants';
import { computeDistanceKm } from '../lib/format';
import type {
  RestaurantListItem,
  RestaurantListResponse,
} from '../types/schemas';

export default function Restaurants() {
  const { data, isLoading, isError } = useAllRestaurantsQuery();
  return (
    <div className='bg-white'>
      <Container className='py-2xl'>
        <div className='flex items-center justify-between'>
          <div className='text-display-sm font-extrabold text-neutral-950'>
            Restaurants
          </div>
          <Link to='/' className='block'>
            <Button variant='primary' size='sm' className='rounded-full px-xl'>
              Home
            </Button>
          </Link>
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
                : (
                    ((data as RestaurantListResponse | undefined)?.data
                      ?.restaurants ?? []) as RestaurantListItem[]
                  ).map((r) => (
                    <Link
                      key={r.id}
                      to={`/restaurant/${r.id}`}
                      className='block'
                    >
                      <RecCardAll r={r} />
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

function RecCardAll({ r }: { r: RestaurantListItem }) {
  const FALLBACK_LAT = -6.175392;
  const FALLBACK_LONG = 106.827153;
  const anyR = r as RestaurantListItem;
  const { data: detail } = useRestaurantDetailQuery(anyR.id, {
    lat: FALLBACK_LAT,
    long: FALLBACK_LONG,
  });
  const coords = anyR.coordinates ?? detail?.data?.coordinates;
  const lat = coords?.lat ?? anyR.lat;
  const long = coords?.long ?? anyR.long;
  const d =
    typeof anyR.distance === 'number'
      ? anyR.distance
      : lat != null && long != null
      ? computeDistanceKm(FALLBACK_LAT, FALLBACK_LONG, lat, long)
      : undefined;
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
