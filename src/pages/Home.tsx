import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { ProductCard, Footer } from '../components';

export default function Home() {
  return (
    <>
      <div className='p-2xl'>
        <h1 className='text-display-2xl leading-display-2xl font-extrabold tracking-display-2xl text-neutral-900'>
          Foody
        </h1>
        <p className='mt-md text-md leading-text text-neutral-700'>Welcome</p>
        <div className='mt-2xl flex items-center gap-md'>
          <Button variant='primary'>Order now</Button>
          <Link to='/cart'>
            <Button variant='neutral'>Go to Cart</Button>
          </Link>
        </div>

        <div className='mt-3xl grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2xl'>
          <ProductCard title='Cheese Burger' price={7.99} />
          <ProductCard title='Chicken Burger' price={6.49} />
          <ProductCard title='Veggie Burger' price={5.99} />
        </div>
      </div>
      <Footer />
    </>
  );
}
