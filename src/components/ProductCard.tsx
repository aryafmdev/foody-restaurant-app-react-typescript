import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Button } from '../ui/button'

type ProductCardProps = {
  title: string
  price: number
  imageUrl?: string | null
}

export default function ProductCard({ title, price, imageUrl }: ProductCardProps) {
  return (
    <Card className="w-[240px] overflow-hidden">
      <CardHeader className="p-none">
        <div className="h-[160px] bg-neutral-200" style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </CardHeader>
      <CardContent>
        <div className="text-md font-semibold text-neutral-900">{title}</div>
        <div className="mt-xs text-sm text-neutral-700">${price.toFixed(2)}</div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm" className="w-full">Add to cart</Button>
      </CardFooter>
    </Card>
  )
}
