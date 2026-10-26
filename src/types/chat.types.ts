export type ChatSender = 'cliente' | 'conductor' | 'soporte'

export interface ChatMessage {
  id: string
  from: ChatSender
  text: string
  ts: string
}

export interface Conversation {
  id: string
  title: string
  subtitle: string
  avatarInitials: string
  orderId?: string
  messages: ChatMessage[]
}
