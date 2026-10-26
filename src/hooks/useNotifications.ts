import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotificationsList, readAllNotifications, readNotification } from '@/services/notifications.service'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsList,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => readNotification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => readAllNotifications(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
