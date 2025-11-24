import { useSelector } from 'react-redux'
import type { RootState } from '../app/store'

export default function Cart() {
  const items = useSelector((s: RootState) => s.cart.items)
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Cart</h1>
      <p className="mt-2 text-sm">{items.length} item(s)</p>
    </div>
  )
}
