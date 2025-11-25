import { Container } from '../ui/container';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { ShoppingCart, Heart, Search, MapPin } from 'lucide-react';
import {
  SearchBar,
  FilterBar,
  CategoryChipGroup,
  IconActionBar,
  RatingGroup,
  PriceWithBadge,
  ReviewCard,
  ProductCard,
  RestaurantInfoCard,
  CartItemRow,
  EmptyState,
  AlertBanner,
  PaginationDots,
  SegmentedControl,
  MapPinChip,
  AddressSummaryRow,
  OrderSummary,
  ProfileMiniCard,
} from '../components';

export default function MoleculesPreview() {
  return (
    <Container className='py-2xl space-y-2xl'>
      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Search & Filters</div>
        </CardHeader>
        <CardContent className='space-y-md'>
          <SearchBar value='' onChange={() => {}} onSubmit={() => {}} />
          <FilterBar
            categories={[
              { id: 'burger', label: 'Burger', checked: true },
              { id: 'pizza', label: 'Pizza' },
            ]}
            promoOnly={false}
          />
          <CategoryChipGroup
            items={[
              { id: 'best', label: 'Best Seller', active: true },
              { id: 'nearby', label: 'Nearby' },
            ]}
          />
          <SegmentedControl
            options={[
              { label: 'Delivery', value: 'delivery' },
              { label: 'Pickup', value: 'pickup' },
            ]}
            value={'delivery'}
            onChange={() => {}}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Actions & Indicators</div>
        </CardHeader>
        <CardContent className='space-y-md'>
          <IconActionBar
            actions={[
              {
                id: 'cart',
                icon: <ShoppingCart size={18} />,
                ariaLabel: 'Cart',
              },
              { id: 'fav', icon: <Heart size={18} />, ariaLabel: 'Favorite' },
              { id: 'search', icon: <Search size={18} />, ariaLabel: 'Search' },
            ]}
          />
          <RatingGroup rating={4} count={128} />
          <PriceWithBadge price={45000} badgeText='Promo' />
          <PaginationDots count={5} current={2} />
          <MapPinChip label='Jakarta' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Cards & Rows</div>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-lg'>
          <ReviewCard
            name='John Doe'
            rating={5}
            comment='Burger enak, pengantaran cepat.'
            date='2024-01-20'
          />
          <div className=''>
            <ProductCard title='Food Name' price={50000} initialQty={0} />
          </div>
          <RestaurantInfoCard
            name='Burger King'
            place='Jakarta Selatan'
            distanceKm={2.4}
            rating={4.9}
          />
          <CartItemRow
            title='Cheese Burger'
            price={32000}
            imageUrl={undefined}
            quantity={2}
            onQuantityChange={() => {}}
          />
          <ProfileMiniCard name='Guest' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Empty & Alert</div>
        </CardHeader>
        <CardContent className='space-y-md'>
          <EmptyState
            icon={<MapPin />}
            title='Tidak ada restoran'
            description='Coba ubah filter atau lokasi.'
            actionLabel='Ubah filter'
          />
          <AlertBanner
            message='Gagal memuat data'
            variant='error'
            actionLabel='Coba lagi'
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='text-lg font-bold'>Order & Address</div>
        </CardHeader>
        <CardContent className='space-y-md'>
          <AddressSummaryRow address='Jl. Sudirman No. 10, Jakarta' />
          <OrderSummary
            subtotal={100000}
            serviceFee={5000}
            deliveryFee={10000}
            total={115000}
          />
        </CardContent>
        <CardFooter>
          <Button className='w-full'>Checkout</Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
