import type { ImgHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & { fallbackClassName?: string }

export function Image({ className, fallbackClassName, ...props }: ImageProps) {
  return (
    <img
      className={cn('block h-auto w-full rounded-md object-cover bg-neutral-200', className)}
      onError={(e) => {
        const el = e.currentTarget
        el.removeAttribute('src')
        el.className = cn('block h-auto w-full rounded-md object-cover bg-neutral-200', fallbackClassName)
      }}
      {...props}
    />
  )
}
