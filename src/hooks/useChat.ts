import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ChatSender } from '@/types/chat.types'
import { getConversationById, getConversationsList, sendAdminMessage, sendChatMessage } from '@/services/chat.service'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversationsList,
  })
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => getConversationById(id as string),
    enabled: Boolean(id),
    refetchInterval: false,
  })
}

export function useSendMessage(conversationId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => sendChatMessage(conversationId as string, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useSendAdminMessage(conversationId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ text, from }: { text: string; from: ChatSender }) =>
      sendAdminMessage(conversationId as string, text, from),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
