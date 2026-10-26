import type { RatingCriteria } from '@/types/rating.types'

export function averageRating(criteria: RatingCriteria): number {
  const values = Object.values(criteria)
  const sum = values.reduce((acc, v) => acc + v, 0)
  return Math.round((sum / values.length) * 10) / 10
}
