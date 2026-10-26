import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { OrderStatus } from '@/types/order.types'
import { advanceOrder, getOrderById, getOrdersList, reportIncident } from '@/services/orders.service'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrdersList,
  })
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id as string),
    enabled: Boolean(id),
  })
}

export function useAdvanceOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => advanceOrder(orderId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useReportIncident() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, tipo, detalle }: { orderId: string; tipo: string; detalle: string }) =>
      reportIncident(orderId, tipo, detalle),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
