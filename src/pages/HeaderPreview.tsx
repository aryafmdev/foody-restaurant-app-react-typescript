import Navbar from '../components/Navbar';
import { Container } from '../ui/container';

export default function HeaderPreview() {
  return (
    <div>
      <Container className='py-2xl space-y-2xl'>
        <div>
          <div className='text-md font-semibold mb-sm'>
            After login — when scrolling
          </div>
          <Navbar mode='scrolled' loggedIn={true} cartCountOverride={1} />
        </div>
        <div>
          <div className='text-md font-semibold mb-sm'>
            Before login — when scrolling
          </div>
          <Navbar mode='scrolled' loggedIn={false} />
        </div>
        <div>
          <div className='text-md font-semibold mb-sm'>
            Before login — on top
          </div>
          <div className='bg-neutral-900'>
            <Navbar mode='top' loggedIn={false} />
          </div>
        </div>
        <div>
          <div className='text-md font-semibold mb-sm'>
            After login — on top
          </div>
          <div className='bg-neutral-900'>
            <Navbar mode='top' loggedIn={true} cartCountOverride={1} />
          </div>
        </div>
      </Container>
    </div>
  );
}
