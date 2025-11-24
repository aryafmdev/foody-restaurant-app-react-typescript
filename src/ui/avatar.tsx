import type { HTMLAttributes, ImgHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type AvatarProps = {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>

export function Avatar({ src, name, size = 'md', className, ...props }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-md',
  }[size]
  if (src) {
    return <img src={src} alt={name || ''} className={cn('rounded-full object-cover bg-neutral-200', sizes, className)} {...props} />
  }
  const initial = name?.trim()?.[0]?.toUpperCase() || 'U'
  return (
    <div aria-label={name || 'User'} className={cn('rounded-full bg-neutral-300 text-neutral-900 flex items-center justify-center', sizes, className)} {...(props as HTMLAttributes<HTMLDivElement>)}>
      {initial}
    </div>
  )
}
