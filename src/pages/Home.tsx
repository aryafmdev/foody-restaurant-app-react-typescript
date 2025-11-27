import { Link } from 'react-router-dom';
import { Button, Skeleton, Alert } from '../ui';
import { SearchBar, CategoryCard, RestaurantInfoCard } from '../components';
import { Container } from '../ui/container';
import {
  useRecommendedRestaurantsQuery,
  useRestaurantsQuery,
} from '../services/queries/restaurants';
import { useState, useRef } from 'react';
import heroImg from '../assets/images/hero-image.png';
import catAll from '../assets/images/all-restaurant.png';
import catNearby from '../assets/images/nearby.png';
import catDiscount from '../assets/images/discount.png';
import catBestSeller from '../assets/images/best-seller.png';
import catDelivery from '../assets/images/delivery.png';
import catLunch from '../assets/images/lunch.png';

export default function Home() {
  const [search, setSearch] = useState('');

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
      ? { q: search.trim(), page: 1, limit: 12 }
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
      <div className='bg-white'>
        <div className='relative'>
          <img
            src={heroImg}
            alt='Foody hero'
            className='h-[320px] md:h-[420px] w-full object-cover'
          />
          <div className='absolute inset-0 bg-black/50' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Container>
              <div className='mx-auto max-w-[720px] text-center'>
                <h1 className='text-display-2xl leading-display-2xl font-extrabold text-white'>
                  Explore Culinary Experiences
                </h1>
                <p className='mt-xs text-display-xs font-bold text-white'>
                  Search and refine your choice to discover the perfect
                  restaurant.
                </p>
                <div className='mt-2xl'>
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    onSubmit={onSearchSubmit}
                    placeholder='Search restaurants, food and drink'
                    className='mx-auto w-[604px] [&>input]:h-[56px]'
                  />
                </div>
              </div>
            </Container>
          </div>
        </div>

        <Container className='py-2xl'>
          <div className='grid grid-cols-3 md:grid-cols-6 gap-lg'>
            <CategoryCard label='All Restaurant' image={catAll} />
            <CategoryCard label='Nearby' image={catNearby} />
            <CategoryCard label='Discount' image={catDiscount} />
            <CategoryCard label='Best Seller' image={catBestSeller} />
            <CategoryCard label='Delivery' image={catDelivery} />
            <CategoryCard label='Lunch' image={catLunch} />
          </div>

          <div className='mt-3xl flex items-center justify-between'>
            <div className='text-display-sm font-extrabold text-neutral-950'>
              Recommended
            </div>
            <Link to='/restaurants' className='text-md text-primary'>
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
                        <RestaurantInfoCard
                          name={r.name}
                          logo={r.logo}
                          place={r.place}
                          distanceKm={
                            typeof r.distance === 'number'
                              ? r.distance
                              : undefined
                          }
                          rating={typeof r.star === 'number' ? r.star : 0}
                        />
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
                          <RestaurantInfoCard
                            name={r.name}
                            logo={r.logo}
                            place={r.place}
                            distanceKm={
                              typeof r.distance === 'number'
                                ? r.distance
                                : undefined
                            }
                            rating={typeof r.star === 'number' ? r.star : 0}
                          />
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
