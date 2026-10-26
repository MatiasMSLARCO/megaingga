import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { RatingCriteria } from '@/types/rating.types'
import { getRatingByOrder, getRatingsList, submitRating } from '@/services/ratings.service'

export function useRating(orderId: string | undefined) {
  return useQuery({
    queryKey: ['rating', orderId],
    queryFn: () => getRatingByOrder(orderId as string),
    enabled: Boolean(orderId),
  })
}

export function useRatingsList() {
  return useQuery({
    queryKey: ['ratings'],
    queryFn: getRatingsList,
  })
}

export function useSubmitRating() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, criteria, comentario }: { orderId: string; criteria: RatingCriteria; comentario: string }) =>
      submitRating(orderId, criteria, comentario),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['rating', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
