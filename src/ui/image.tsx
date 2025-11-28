import type { ImgHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & { fallbackClassName?: string; fallbackSrc?: string }

export function Image({ className, fallbackClassName, fallbackSrc, ...props }: ImageProps) {
  return (
    <img
      className={cn('block h-auto w-full rounded-md object-cover bg-neutral-200', className)}
      onError={(e) => {
        const el = e.currentTarget
        if (fallbackSrc && el.getAttribute('src') !== fallbackSrc) {
          el.src = fallbackSrc
        } else {
          el.removeAttribute('src')
          el.className = cn('block h-auto w-full rounded-md object-cover bg-neutral-200', fallbackClassName)
        }
      }}
      {...props}
    />
  )
}
