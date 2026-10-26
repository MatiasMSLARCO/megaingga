import type { Rating, RatingCriteria } from '@/types/rating.types'
import { delay } from './delay'
import { getAllRatings, getRating, setOrderRated, pushNotification } from './portalStore'

export async function getRatingByOrder(orderId: string): Promise<Rating | null> {
  await delay()
  return getRating(orderId) ?? null
}

export async function getRatingsList(): Promise<Rating[]> {
  await delay()
  return [...getAllRatings()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function submitRating(orderId: string, criteria: RatingCriteria, comentario: string): Promise<Rating> {
  await delay()
  const rating: Rating = { orderId, criteria, comentario, createdAt: new Date().toISOString() }
  setOrderRated(orderId, rating)
  pushNotification('calificacion', 'Gracias por tu calificación', `Calificaste el pedido ${orderId}.`)
  return rating
}
