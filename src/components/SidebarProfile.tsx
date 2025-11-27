import { Card, CardContent, CardHeader } from '../ui/card'
import { Icon } from '../ui/icon'
import avatarImg from '../assets/images/avatar.png'
import arrowLeft from '../assets/icons/arrow-circle-broken-left.png'

type SidebarProfileProps = {
  name: string
  onProfile?: () => void
  onDeliveryAddress?: () => void
  onMyOrders?: () => void
  onLogout?: () => void
  className?: string
}

export default function SidebarProfile({ name, onProfile, onDeliveryAddress, onMyOrders, onLogout, className }: SidebarProfileProps) {
  return (
    <Card className={["rounded-lg shadow-md p-2xl border border-neutral-200", className].filter(Boolean).join(" ")}> 
      <CardHeader className="border-none mb-2xl">
        <div className="flex items-center gap-md">
          <img src={avatarImg} alt={name} className="h-12 w-12 rounded-full object-cover" />
          <div className="text-lg font-bold text-neutral-950">{name}</div>
        </div>
      </CardHeader>
      <CardContent className="p-2xl pt-none">
        <div className="border-t border-neutral-300" />
        <div className="mt-4xl space-y-5xl">
          <button type="button" className="w-full inline-flex items-center gap-md" onClick={onProfile}>
            <Icon name="mdi:account-outline" size={24} className="text-neutral-900" />
            <span className="text-md font-medium text-neutral-900">Profile</span>
          </button>
          <button type="button" className="w-full inline-flex items-center gap-md" onClick={onDeliveryAddress}>
            <Icon name="mdi:map-marker-outline" size={24} className="text-neutral-900" />
            <span className="text-md font-medium text-neutral-900">Delivery Address</span>
          </button>
          <button type="button" className="w-full inline-flex items-center gap-md" onClick={onMyOrders}>
            <Icon name="akar-icons:file" size={24} className="text-neutral-900" />
            <span className="text-md font-medium text-neutral-900">My Orders</span>
          </button>
          <button type="button" className="w-full inline-flex items-center gap-md" onClick={onLogout}>
            <img src={arrowLeft} alt="Logout" className="h-6 w-6" />
            <span className="text-md font-medium text-neutral-900">Logout</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
