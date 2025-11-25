import { Card, CardContent, CardHeader } from '../ui/card'
import { Avatar } from '../ui/avatar'
import RatingGroup from './RatingGroup'

type ReviewCardProps = {
  name: string
  avatarUrl?: string
  rating: number
  comment: string
  date?: string
}

export default function ReviewCard({ name, avatarUrl, rating, comment, date }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-sm">
          <Avatar name={name} src={avatarUrl} />
          <div>
            <div className="text-md font-semibold">{name}</div>
            <RatingGroup rating={rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-700">{comment}</p>
        {date ? <div className="mt-xs text-xs text-neutral-500">{date}</div> : null}
      </CardContent>
    </Card>
  )
}
