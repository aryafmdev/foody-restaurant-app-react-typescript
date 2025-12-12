import { useParams } from 'react-router-dom';
import { useRestaurantDetailQuery } from '../services/queries/restaurants';
import {
  useRestaurantReviewsQuery,
  useMyReviewsQuery,
} from '../services/queries/reviews';
import {
  useAddToCartMutation,
  useCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  getPendingQty,
} from '../services/queries/cart';
import { Container } from '../ui/container';
import { Image } from '../ui/image';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Alert } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import {
  CategoryChipGroup,
  ProductCard,
  ReviewCard,
  StickyCheckoutBar,
} from '../components';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import fallbackImg from '../assets/images/fallback-image.png';
import { formatPlaceAndDistance, computeDistanceKm } from '../lib/format';
import { useNavigate } from 'react-router-dom';
import type { GetCartResponse } from '../types/schemas';

export default function RestaurantDetail() {
  const params = useParams();
  const id = Number(params.id);
  const [menuLimit, setMenuLimit] = useState(10);
  const [reviewLimit, setReviewLimit] = useState(10);
  const [menuType, setMenuType] = useState<'all' | 'food' | 'drink'>('all');
  const [imgIndex, setImgIndex] = useState(0);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const userLat =
    typeof authUser?.latitude === 'number' ? authUser!.latitude : undefined;
  const userLong =
    typeof authUser?.longitude === 'number' ? authUser!.longitude : undefined;
  const { data, isLoading, isError } = useRestaurantDetailQuery(id, {
    limitMenu: menuLimit,
    limitReview: reviewLimit,
    lat: userLat,
    long: userLong,
  });
  const { data: reviewData } = useRestaurantReviewsQuery(id, {
    page: 1,
    limit: reviewLimit,
  });
  const { data: myReviewsData } = useMyReviewsQuery();
  const userId = useSelector((s: RootState) => s.auth.userId);
  const addToCart = useAddToCartMutation(userId ?? 'guest');
  const token = useSelector((s: RootState) => s.auth.token);
  const isLoggedIn = !!token;
  const { data: cart } = useCartQuery(userId, isLoggedIn);
  const updateQty = useUpdateCartItemMutation(userId ?? 'guest');
  const removeItem = useDeleteCartItemMutation(userId ?? 'guest');
  const cartData = cart as GetCartResponse | undefined;
  const summary = cartData?.data?.summary;
  const navigate = useNavigate();
  const [localQty, setLocalQty] = useState<Record<number, number>>({});

  if (!id) return null;
  if (isLoading)
    return (
      <Container className='py-2xl'>
        <div className='grid grid-cols-1 md:grid-cols-[5fr_4fr] gap-lg'>
          <Skeleton className='h-[220px] md:h-[320px] rounded-lg md:col-span-2' />
          <div className='space-y-md'>
            <Skeleton className='h-[140px] rounded-lg' />
            <div className='grid grid-cols-2 gap-md'>
              <Skeleton className='h-[140px] rounded-lg' />
              <Skeleton className='h-[140px] rounded-lg' />
            </div>
          </div>
        </div>
      </Container>
    );
  if (isError)
    return (
      <Container className='py-2xl'>
        <Alert variant='error'>Failed to load restaurant</Alert>
      </Container>
    );
  if (!data?.data) return <Container className='py-2xl'>Not found</Container>;

  const resto = data.data;
  const images = resto.images ?? [];
  const cleaned = images.filter(
    (s) => typeof s === 'string' && s.trim().length > 0
  );
  const first = cleaned[0] ?? fallbackImg;
  const gallery = [0, 1, 2, 3].map((i) => {
    if (cleaned.length === 0) return resto.logo || fallbackImg;
    if (cleaned.length === 1) return first;
    return cleaned[i % cleaned.length];
  });
  const menus = resto.menus ?? [];
  const filteredMenus =
    menuType === 'all'
      ? menus
      : menus.filter(
          (m) =>
            (m.type ?? '').toLowerCase() ===
            (menuType === 'food' ? 'food' : 'drink')
        );
  const canShowMoreMenus = (resto.totalMenus ?? 0) > (resto.menus?.length ?? 0);
  const rvList = reviewData?.data?.reviews ?? [];
  const myRvList = (myReviewsData?.data?.reviews ?? []).filter(
    (rv) => rv.restaurant?.id === id
  );
  const rvIds = new Set(rvList.map((r) => r.id));
  const mergedRv = rvList.concat(myRvList.filter((r) => !rvIds.has(r.id)));
  const rvStats = reviewData?.data?.statistics;
  const rvPag = reviewData?.data?.pagination;
  const reviewCount =
    (rvPag?.total ?? rvStats?.totalReviews ?? mergedRv.length) || 0;
  const canShowMoreReviews = (rvPag?.total ?? 0) > mergedRv.length;
  const ratingValue =
    typeof resto.averageRating === 'number' ? resto.averageRating : resto.star;
  const FALLBACK_LAT = -6.175392;
  const FALLBACK_LONG = 106.827153;
  const baseLat = typeof userLat === 'number' ? userLat : FALLBACK_LAT;
  const baseLong = typeof userLong === 'number' ? userLong : FALLBACK_LONG;
  const coords = resto.coordinates;
  const distanceKm =
    coords?.lat != null && coords?.long != null
      ? computeDistanceKm(baseLat, baseLong, coords.lat, coords.long)
      : undefined;

  const share = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className='bg-neutral-100'>
      <Container className='py-2xl'>
        <div className='grid grid-cols-1 md:grid-cols-9 gap-md'>
          <div className='block md:hidden'>
            <div className='w-full'>
              <Image
                src={gallery[imgIndex]}
                fallbackSrc={fallbackImg}
                alt={resto.name}
                className='h-[260.63px] md:h-full w-full rounded-lg object-cover'
              />
            </div>
            <div className='mt-sm flex items-center justify-center gap-xxs'>
              {gallery.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => setImgIndex(i)}
                  className={
                    'h-2.5 w-2.5 rounded-full ' +
                    (i === imgIndex ? 'bg-primary' : 'bg-neutral-300')
                  }
                />
              ))}
            </div>
          </div>
          <div className='hidden md:block md:col-span-5 md:max-h-170'>
            <Image
              src={gallery[0]}
              fallbackSrc={fallbackImg}
              alt={resto.name}
              className='h-full w-full rounded-lg object-cover'
            />
          </div>
          <div className='hidden md:grid md:max-h-170 md:grid-rows-3 gap-md md:col-span-4'>
            <div className='overflow-hidden rounded-lg md:row-span-2'>
              <Image
                src={gallery[1]}
                fallbackSrc={fallbackImg}
                alt={resto.name}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='grid grid-cols-2 gap-md md:row-span-1'>
              <div className='overflow-hidden rounded-lg h-full'>
                <Image
                  src={gallery[2]}
                  fallbackSrc={fallbackImg}
                  alt={resto.name}
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='overflow-hidden rounded-lg h-full'>
                <Image
                  src={gallery[3]}
                  fallbackSrc={fallbackImg}
                  alt={resto.name}
                  className='h-full w-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-xl flex items-center justify-between'>
          <div className='flex items-center gap-md'>
            <div className='h-14 w-14 md:h-16 md:w-16 rounded-full overflow-hidden bg-neutral-200 shrink-0'>
              <Image
                alt={resto.name}
                src={resto.logo || fallbackImg}
                fallbackSrc={fallbackImg}
                className='h-full w-full object-contain bg-white'
              />
            </div>
            <div>
              <div className='text-lg md:text-xl font-extrabold text-neutral-950'>
                {resto.name}
              </div>
              <div className='mt-xxs inline-flex items-center gap-xxs'>
                <Icon
                  name='material-symbols:star-rounded'
                  size={18}
                  className='text-accent-yellow'
                />
                <span className='text-sm md:text-md text-neutral-900'>
                  {ratingValue.toFixed(1)}
                </span>
              </div>
              <div className='mt-xxs text-sm md:text-md text-neutral-700'>
                {formatPlaceAndDistance(
                  resto.place ?? 'Jakarta Pusat',
                  distanceKm
                )}
              </div>
            </div>
          </div>
          <Button
            variant='neutral'
            onClick={share}
            className='border border-neutral-300 bg-transparent rounded-full h-10 w-10 md:h-11 md:rounded-full'
          >
            <span className='inline-flex items-center gap-xs text-neutral-950'>
              <Icon name='tdesign:share' size={20} />
              <span className='hidden md:inline'>Share</span>
            </span>
          </Button>
        </div>

        <div className='mt-2xl border-t border-neutral-300'>
          <div className='text-display-sm mt-2xl font-extrabold text-neutral-950'>
            Menu
          </div>
          <CategoryChipGroup
            className='mt-lg hidden md:flex'
            items={[
              { id: 'all', label: 'All Menu', active: menuType === 'all' },
              { id: 'food', label: 'Food', active: menuType === 'food' },
              { id: 'drink', label: 'Drink', active: menuType === 'drink' },
            ]}
            activeVariant='primary-outline'
            inactiveVariant='neutral-outline'
            activeSize='md'
            inactiveSize='lg'
            onToggle={(id) => setMenuType(id as 'all' | 'food' | 'drink')}
          />
          <CategoryChipGroup
            className='mt-lg flex md:hidden'
            items={[
              { id: 'all', label: 'All Menu', active: menuType === 'all' },
              { id: 'food', label: 'Food', active: menuType === 'food' },
              { id: 'drink', label: 'Drink', active: menuType === 'drink' },
            ]}
            activeVariant='primary-outline'
            inactiveVariant='neutral-outline'
            activeSize='md'
            inactiveSize='lg'
            onToggle={(id) => setMenuType(id as 'all' | 'food' | 'drink')}
          />
          <div className='mt-xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2xl'>
            {filteredMenus.map((m) => (
              <ProductCard
                key={m.id}
                title={m.foodName}
                price={m.price}
                imageUrl={m.image}
                initialQty={(() => {
                  if (!isLoggedIn) return localQty[m.id] ?? 0;
                  const groups = (cartData?.data?.cart ??
                    []) as GetCartResponse['data']['cart'];
                  const group = groups.find(
                    (g) => g.restaurant.id === resto.id
                  );
                  const existing = group?.items.find(
                    (it) => it.menu.id === m.id
                  );
                  const p = getPendingQty(userId ?? 'guest', resto.id, m.id);
                  return Math.max(existing?.quantity ?? 0, p);
                })()}
                onQuantityChange={(q) => {
                  setLocalQty((prev) => {
                    const next = { ...prev };
                    if (q > 0) next[m.id] = q;
                    else delete next[m.id];
                    return next;
                  });
                  if (isLoggedIn) {
                    const groups = (cartData?.data?.cart ??
                      []) as GetCartResponse['data']['cart'];
                    const group = groups.find(
                      (g) => g.restaurant.id === resto.id
                    );
                    const existing = group?.items.find(
                      (it) => it.menu.id === m.id
                    );
                    if (!existing) {
                      if (q > 0)
                        addToCart.mutate({
                          body: {
                            restaurantId: resto.id,
                            menuId: m.id,
                            quantity: q,
                          },
                          optimistic: {
                            restaurant: {
                              id: resto.id,
                              name: resto.name,
                              logo: resto.logo ?? '',
                            },
                            menu: {
                              id: m.id,
                              foodName: m.foodName,
                              price: m.price,
                              type: m.type,
                              image: m.image,
                            },
                            quantity: q,
                          },
                        });
                    } else {
                      if (q <= 0) removeItem.mutate({ id: existing.id });
                      else
                        updateQty.mutate({
                          id: existing.id,
                          quantity: q,
                          optimistic: {
                            restaurant: {
                              id: resto.id,
                              name: resto.name,
                              logo: resto.logo ?? '',
                            },
                            menu: {
                              id: m.id,
                              foodName: m.foodName,
                              price: m.price,
                              type: m.type,
                              image: m.image,
                            },
                            quantity: q,
                          },
                        });
                    }
                  }
                }}
              />
            ))}
          </div>
          {canShowMoreMenus ? (
            <div className='mt-2xl flex justify-center'>
              <Button
                variant='neutral'
                className=''
                onClick={() => setMenuLimit(menuLimit + 6)}
              >
                Show More
              </Button>
            </div>
          ) : null}
        </div>

        <div className='mt-3xl'>
          <div className='border-t border-neutral-300 pt-2xl'>
            <div className='text-display-xs font-extrabold text-neutral-950'>
              Review
            </div>
            <div className='mt-sm inline-flex md:hidden items-center gap-xxs text-neutral-900'>
              <Icon
                name='material-symbols:star-rounded'
                size={18}
                className='text-accent-yellow'
              />
              <span className='text-m font-extrabold'>
                {ratingValue.toFixed(1)} ({rvStats?.totalReviews ?? 0} Ulasan)
              </span>
            </div>
            <div className='hidden md:flex items-center justify-between'>
              <div className='mt-sm inline-flex items-center gap-xxs text-neutral-900'>
                <Icon
                  name='material-symbols:star-rounded'
                  size={18}
                  className='text-accent-yellow'
                />
                <span className='text-md'>
                  {ratingValue.toFixed(1)} ({reviewCount} Ulasan)
                </span>
              </div>
            </div>
          </div>
          <div className='mt-xl grid grid-cols-1 md:grid-cols-2 gap-2xl'>
            {mergedRv.map((rv) => (
              <ReviewCard
                key={rv.id}
                name={rv.user?.name ?? authUser?.name ?? 'Anonymous'}
                avatarUrl={
                  rv.user?.id != null && String(rv.user.id) !== (userId ?? '')
                    ? undefined
                    : authUser?.avatar ?? undefined
                }
                rating={rv.star}
                comment={rv.comment ?? ''}
                date={rv.updatedAt ?? rv.createdAt}
              />
            ))}
          </div>
          {canShowMoreReviews ? (
            <div className='mt-2xl flex justify-center'>
              <Button
                variant='neutral'
                onClick={() => setReviewLimit(reviewLimit + 10)}
              >
                Show More
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
      {(() => {
        const localItems = Object.values(localQty).reduce((a, b) => a + b, 0);
        const localTotal = Object.entries(localQty).reduce((sum, [id, q]) => {
          const price =
            (resto.menus ?? []).find((mm) => mm.id === Number(id))?.price ?? 0;
          return sum + price * q;
        }, 0);
        const showLogged = !!summary && summary.totalItems > 0;
        const showGuest = !isLoggedIn && localItems > 0;
        const itemsCount = isLoggedIn ? summary?.totalItems ?? 0 : localItems;
        const totalPrice = isLoggedIn ? summary?.totalPrice ?? 0 : localTotal;
        return (
          <StickyCheckoutBar
            itemsCount={itemsCount}
            totalPrice={totalPrice}
            onCheckout={() => navigate(isLoggedIn ? '/checkout' : '/login')}
            iconName='lets-icons:bag-fill'
            visible={showLogged || showGuest}
            showOnMobileOnly
          />
        );
      })()}
    </div>
  );
}
