import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card'
import { useCartQuery, useUpdateCartItemMutation, useDeleteCartItemMutation, useClearCartMutation } from '../services/queries/cart'

export default function Cart() {
  const { data, isLoading } = useCartQuery()
  const updateQty = useUpdateCartItemMutation()
  const removeItem = useDeleteCartItemMutation()
  const clearCart = useClearCartMutation()
  if (isLoading) return <div className="p-2xl">Loading...</div>
  const groups = data?.data?.restaurants ?? []
  const summary = data?.data?.summary
  return (
    <div className="p-2xl">
      <div className="text-display-md font-bold">Cart</div>
      <div className="mt-xs text-sm text-neutral-700">{summary ? `${summary.totalItems} items • $${(summary.totalPrice / 100).toFixed(2)}` : ''}</div>
      <div className="mt-2xl space-y-2xl">
        {groups.map((g, gi) => (
          <Card key={gi}>
            <CardHeader>
              <div className="text-md font-semibold">{g.restaurant.name}</div>
              <div className="text-sm text-neutral-700">Subtotal ${((g.subtotal ?? 0) / 100).toFixed(2)}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                {g.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{it.menu.foodName}</div>
                      <div className="text-xs text-neutral-700">${(it.itemTotal / 100).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-sm">
                      <Button size="sm" variant="neutral" onClick={() => updateQty.mutate({ id: it.id, quantity: it.quantity - 1 })} disabled={it.quantity <= 1}>-</Button>
                      <div className="w-10 text-center">{it.quantity}</div>
                      <Button size="sm" variant="neutral" onClick={() => updateQty.mutate({ id: it.id, quantity: it.quantity + 1 })}>+</Button>
                      <Button size="sm" variant="danger" onClick={() => removeItem.mutate(it.id)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => clearCart.mutate()}>Clear cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
