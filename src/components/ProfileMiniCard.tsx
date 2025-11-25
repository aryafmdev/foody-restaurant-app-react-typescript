import { Card, CardContent, CardHeader } from '../ui/card'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'

type ProfileMiniCardProps = {
  name: string
  avatarUrl?: string
  onLogin?: () => void
  onLogout?: () => void
}

export default function ProfileMiniCard({ name, avatarUrl, onLogin, onLogout }: ProfileMiniCardProps) {
  return (
    <Card className="w-[280px]">
      <CardHeader>
        <div className="flex items-center gap-sm">
          <Avatar name={name} src={avatarUrl} />
          <div className="text-md font-semibold">{name}</div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-sm">
        {onLogin ? <Button variant="neutral" onClick={onLogin}>Login</Button> : null}
        {onLogout ? <Button variant="danger" onClick={onLogout}>Logout</Button> : null}
      </CardContent>
    </Card>
  )
}
