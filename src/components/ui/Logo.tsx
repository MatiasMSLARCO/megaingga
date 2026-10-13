import type { ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface LogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  className?: string
}

/**
 * Logotipo oficial vectorial SVG de MEGA INGENIERÍA (fondo transparente).
 */
export function Logo({ className, alt = 'MEGA INGENIERÍA - MEGAINGGA S.A.', ...props }: LogoProps) {
  return (
    <img
      src="/assets/images/logo.svg"
      alt={alt}
      className={cn('h-9 w-auto object-contain select-none', className)}
      loading="eager"
      decoding="async"
      {...props}
    />
  )
}
