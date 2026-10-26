import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md'
}

export function StarRating({ value, onChange, readOnly = false, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const displayValue = hovered ?? value
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(null)}
          aria-label={`${star} estrellas`}
          className={cn(readOnly ? 'cursor-default' : 'cursor-pointer')}
        >
          <Star
            className={cn(starSize, star <= displayValue ? 'fill-brand-red text-brand-red' : 'fill-none text-brand-border')}
          />
        </button>
      ))}
    </div>
  )
}
