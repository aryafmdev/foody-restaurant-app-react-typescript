import { Link, useNavigate } from 'react-router-dom';
import { Button, Skeleton, Alert } from '../ui';
import { SearchBar, CategoryCard, RestaurantInfoCard } from '../components';
import { Container } from '../ui/container';
import {
  useRecommendedRestaurantsQuery,
  useRestaurantsQuery,
} from '../services/queries/restaurants';
import { computeDistanceKm } from '../lib/format';
import type { RestaurantListItem } from '../types/schemas';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import heroImg from '../assets/images/hero-image.png';
import catAll from '../assets/images/all-restaurant.png';
import catNearby from '../assets/images/nearby.png';
import catDiscount from '../assets/images/discount.png';
import catBestSeller from '../assets/images/best-seller.png';
import catDelivery from '../assets/images/delivery.png';
import catLunch from '../assets/images/lunch.png';

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const authUser = useSelector((s: RootState) => s.auth.user);
  const userLat =
    typeof authUser?.latitude === 'number' ? authUser!.latitude : undefined;
  const userLong =
    typeof authUser?.longitude === 'number' ? authUser!.longitude : undefined;

  const {
    data: rec,
    isLoading: recLoading,
    isError: recError,
  } = useRecommendedRestaurantsQuery();
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
  } = useRestaurantsQuery(
    searchSubmitted && search.trim()
      ? { q: search.trim(), page: 1, limit: 12, lat: userLat, long: userLong }
      : userLat != null && userLong != null
      ? { lat: userLat, long: userLong, page: 1, limit: 12 }
      : undefined
  );
  const [extraRecommendedCount, setExtraRecommendedCount] = useState(0);
  const recList = rec?.data?.recommendations ?? [];
  const baseCount = 12;
  const totalTarget = baseCount + extraRecommendedCount;
  const realItems = recList.slice(0, Math.min(recList.length, totalTarget));
  const fallbackCount = Math.max(0, totalTarget - realItems.length);
  const fallbackItems = Array.from({ length: fallbackCount }).map((_, i) => ({
    id: `f-${i}`,
    name: 'Foody Restaurant',
    logo: undefined,
    place: 'Nearby',
    star: 0,
  }));
  const canShowMore =
    extraRecommendedCount === 0 &&
    (recList.length > baseCount || recList.length <= baseCount);
  const searchResultsRef = useRef<HTMLDivElement | null>(null);
  const onSearchSubmit = () => {
    setSearchSubmitted(true);
    setTimeout(() => {
      const el = searchResultsRef.current;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };
  return (
    <>
      <div className='bg-neutral-100'>
        <div className='relative'>
          <img
            src={heroImg}
            alt='Foody hero'
            className='h-[clamp(648px,57.43vw,827px)] w-full object-cover'
          />
          <div className='absolute inset-0 bg-black/50' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Container>
              <div className='mx-auto max-w-[720px] text-center'>
                <h1 className='text-[clamp(2rem,3.33vw,3rem)] leading-display-2xl font-extrabold text-white'>
                  Explore Culinary Experiences
                </h1>
                <p className='mt-xs text-[clamp(1rem,4.58vw,1.125rem)] md:text-display-xs font-bold text-white'>
                  Search and refine your choice to discover the perfect
                  restaurant.
                </p>
                <div className='mt-2xl'>
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    onSubmit={onSearchSubmit}
                    placeholder='Search restaurants, food and drink'
                    className='mx-auto text-sm w-[clamp(349px,41.94vw,604px)] h-[clamp(48px,3.88vw,56px)] [&>input]:h-[clamp(48px,3.88vw,56px)]'
                  />
                </div>
              </div>
            </Container>
          </div>
        </div>

        <Container className='py-4xl md:py-6xl'>
          <div className='grid grid-cols-3 md:grid-cols-6 gap-lg md:gap-6xl'>
            <CategoryCard
              label='All Restaurant'
              image={catAll}
              onClick={() => navigate('/restaurants')}
            />
            <CategoryCard
              label='Nearby'
              image={catNearby}
              onClick={() => navigate('/restaurants?distance=nearby')}
            />
            <CategoryCard
              label='Discount'
              image={catDiscount}
              onClick={() => navigate('/restaurants?priceMax=50000')}
            />
            <CategoryCard
              label='Best Seller'
              image={catBestSeller}
              onClick={() => navigate('/restaurants?ratings=5')}
            />
            <CategoryCard
              label='Delivery'
              image={catDelivery}
              onClick={() => navigate('/restaurants?distance=1km')}
            />
            <CategoryCard
              label='Lunch'
              image={catLunch}
              onClick={() => {
                const q = search.trim();
                navigate(
                  q ? `/restaurants?q=${encodeURIComponent(q)}` : '/restaurants'
                );
              }}
            />
          </div>

          <div className='mt-3xl flex items-center justify-between'>
            <div className='text-display-sm font-extrabold text-neutral-950'>
              Recommended
            </div>
            <Link
              to='/restaurants'
              className='text-md text-primary font-extrabold'
            >
              See All
            </Link>
          </div>
          {recError ? (
            <div className='mt-xl'>
              <Alert variant='error'>
                Failed to load recommended restaurants
              </Alert>
            </div>
          ) : (
            <>
              <div className='mt-xl grid grid-cols-1 md:grid-cols-3 gap-2xl'>
                {recLoading ? (
                  Array.from({ length: 12 }).map((_, i) => (
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
                ) : (
                  <>
                    {realItems.map((r) => (
                      <Link
                        key={r.id}
                        to={`/restaurant/${r.id}`}
                        className='block'
                      >
                        <RecCard r={r} />
                      </Link>
                    ))}
                    {fallbackItems.map((f) => (
                      <div key={f.id} className='block'>
                        <RestaurantInfoCard
                          name={f.name}
                          logo={f.logo}
                          place={f.place}
                          rating={0}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
              {canShowMore ? (
                <div className='mt-2xl flex justify-center'>
                  <Button
                    variant='neutral'
                    onClick={() => setExtraRecommendedCount(3)}
                    disabled={extraRecommendedCount > 0}
                  >
                    Show More
                  </Button>
                </div>
              ) : null}
            </>
          )}

          <div
            ref={searchResultsRef}
            className='-mt-16 md:-mt-20 pt-16 md:pt-20'
          />
          {searchSubmitted && search.trim() ? (
            <>
              <div className='mt-3xl text-display-sm font-extrabold text-neutral-950'>
                Search Results
              </div>
              {listError ? (
                <div className='mt-xl'>
                  <Alert variant='error'>Failed to load restaurants</Alert>
                </div>
              ) : (
                <div className='mt-xl grid grid-cols-1 md:grid-cols-3 gap-2xl'>
                  {listLoading
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
                    : (list?.data?.restaurants ?? []).map((r) => (
                        <Link
                          key={r.id}
                          to={`/restaurant/${r.id}`}
                          className='block'
                        >
                          <RecCard r={r} />
                        </Link>
                      ))}
                </div>
              )}
            </>
          ) : null}
        </Container>
      </div>
    </>
  );
}

function RecCard({ r }: { r: RestaurantListItem }) {
  const FALLBACK_LAT = -6.175392;
  const FALLBACK_LONG = 106.827153;
  const authUser = useSelector((s: RootState) => s.auth.user);
  const baseLat =
    typeof authUser?.latitude === 'number' ? authUser!.latitude : FALLBACK_LAT;
  const baseLong =
    typeof authUser?.longitude === 'number'
      ? authUser!.longitude
      : FALLBACK_LONG;
  const anyR = r as RestaurantListItem;
  const coords = anyR.coordinates;
  const lat = coords?.lat ?? anyR.lat;
  const long = coords?.long ?? anyR.long;
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
  const useBackendDistance =
    typeof anyR.distance === 'number' &&
    isFinite(anyR.distance) &&
    anyR.distance >= 0;
  const hasCoords =
    typeof lat === 'number' &&
    isFinite(lat!) &&
    typeof long === 'number' &&
    isFinite(long!);
  const d = useBackendDistance
    ? (anyR.distance as number)
    : hasCoords
    ? computeDistanceKm(baseLat, baseLong, lat as number, long as number)
    : fallbackDistFor(anyR.id ?? anyR.name);
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
