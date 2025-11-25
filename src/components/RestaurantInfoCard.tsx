import { Card, CardContent, CardHeader } from '../ui/card'
import { Image } from '../ui/image'
import RatingGroup from './RatingGroup'

type RestaurantInfoCardProps = {
  name: string
  logo?: string
  place?: string
  rating?: number
}

export default function RestaurantInfoCard({ name, logo, place, rating = 0 }: RestaurantInfoCardProps) {
  return (
    <Card className="w-[280px] overflow-hidden">
      <CardHeader className="p-lg">
        <div className="flex items-center gap-sm">
          <div className="h-10 w-10 rounded-md overflow-hidden bg-neutral-200">
            {logo ? <Image alt={name} src={logo} className="h-full w-full" /> : null}
          </div>
          <div>
            <div className="text-md font-semibold">{name}</div>
            {place ? <div className="text-sm text-neutral-700">{place}</div> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RatingGroup rating={rating} />
      </CardContent>
    </Card>
  )
}
