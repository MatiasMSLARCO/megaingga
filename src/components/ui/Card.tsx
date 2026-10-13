import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-brand-border-soft bg-white shadow-sm transition-shadow duration-200 hover:shadow-md',
        className
      )}
      {...props}
    />
  )
}
