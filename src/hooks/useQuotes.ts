import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PortalQuoteStatus, QuoteItem } from '@/types/quote.types'
import { approveQuote, createPortalQuote, getPortalQuotes, updateQuoteStatus } from '@/services/quotes.service'

export function useQuotes() {
  return useQuery({
    queryKey: ['portal-quotes'],
    queryFn: getPortalQuotes,
  })
}

export function useCreateQuote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      items,
      details,
    }: {
      items: QuoteItem[]
      details?: { projectName?: string; requiredDate?: string; notes?: string }
    }) => createPortalQuote(items, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-quotes'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PortalQuoteStatus }) => updateQuoteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-quotes'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useApproveQuote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (quoteId: string) => approveQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-quotes'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
