import { useParams } from 'react-router-dom';
import { useRestaurantDetailQuery } from '../services/queries/restaurants';
import { useAddToCartMutation } from '../services/queries/cart';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';

export default function RestaurantDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { data, isLoading } = useRestaurantDetailQuery(id, { limit: 10 });
  const addToCart = useAddToCartMutation();

  if (!id) return null;
  if (isLoading) return <div className="p-2xl">Loading...</div>;
  if (!data?.data) return <div className="p-2xl">Not found</div>;

  const resto = data.data;

  return (
    <div className="p-2xl">
      <div className="text-display-md font-bold">{resto.name}</div>
      <div className="mt-xs text-sm text-neutral-700">{resto.place}</div>
      <div className="mt-2xl grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2xl">
        {(resto.menus ?? []).map((m) => (
          <Card key={m.id} className="overflow-hidden">
            <CardHeader className="p-none">
              <div className="h-[160px] bg-neutral-200" style={{ backgroundImage: m.image ? `url(${m.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </CardHeader>
            <CardContent>
              <div className="text-md font-semibold text-neutral-900">{m.foodName}</div>
              <div className="mt-xs text-sm text-neutral-700">${(m.price / 100).toFixed(2)}</div>
              <Button size="sm" className="mt-md" onClick={() => addToCart.mutate({ restaurantId: resto.id, menuId: m.id })}>Add to cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
