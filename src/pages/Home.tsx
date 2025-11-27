import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { SearchBar, CategoryCard, RestaurantInfoCard } from '../components';
import { Container } from '../ui/container';
import heroImg from '../assets/images/hero-image.png';
import catAll from '../assets/images/all-restaurant.png';
import catNearby from '../assets/images/nearby.png';
import catDiscount from '../assets/images/discount.png';
import catBestSeller from '../assets/images/best-seller.png';
import catDelivery from '../assets/images/delivery.png';
import catLunch from '../assets/images/lunch.png';

export default function Home() {
  return (
    <>
      <div className='bg-white'>
        <div className='relative'>
          <img
            src={heroImg}
            alt='Foody hero'
            className='h-[320px] md:h-[420px] w-full object-cover'
          />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Container>
              <div className='mx-auto max-w-[720px] text-center'>
                <h1 className='text-display-2xl leading-display-2xl font-extrabold text-white'>
                  Explore Culinary Experiences
                </h1>
                <p className='mt-xs text-md text-neutral-200'>
                  Search and refine your choice to discover the perfect
                  restaurant.
                </p>
                <div className='mt-lg'>
                  <SearchBar
                    value={''}
                    onChange={() => {}}
                    placeholder='Search restaurants, food and drink'
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
          <div className='mt-xl grid grid-cols-1 md:grid-cols-3 gap-2xl'>
            {Array.from({ length: 12 }).map((_, i) => (
              <RestaurantInfoCard
                key={i}
                name='Burger King'
                rating={4.9}
                place='Jakarta Selatan'
                distanceKm={2.4}
              />
            ))}
          </div>
          <div className='mt-2xl flex justify-center'>
            <Button variant='neutral'>Show More</Button>
          </div>
        </Container>
      </div>
    </>
  );
}
