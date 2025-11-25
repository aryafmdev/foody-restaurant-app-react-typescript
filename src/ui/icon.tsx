import { Icon as Iconify } from '@iconify/react'

type IconProps = {
  name: string
  size?: number
  className?: string
}

export function Icon({ name, size = 18, className }: IconProps) {
  return <Iconify icon={name} width={size} height={size} className={className} />
}
