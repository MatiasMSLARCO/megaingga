import type { ChatMessage, ChatSender, Conversation } from '@/types/chat.types'
import { delay } from './delay'
import { appendMessage, getConversation, getConversations, pushNotification } from './portalStore'
import { DRIVER_CHAT_SCRIPT } from '@/data/driver.mock'

function pickScriptedReply(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('hola')) return DRIVER_CHAT_SCRIPT.hola
  if (lower.includes('eta') || lower.includes('cuanto') || lower.includes('tiempo')) return DRIVER_CHAT_SCRIPT.eta
  if (lower.includes('donde') || lower.includes('ubicaci')) return DRIVER_CHAT_SCRIPT.ubicacion
  if (lower.includes('gracias')) return DRIVER_CHAT_SCRIPT.gracias
  return DRIVER_CHAT_SCRIPT.default
}

function generateMsgId(): string {
  return `msg-${Math.floor(1000 + Math.random() * 9000)}`
}

export async function getConversationsList(): Promise<Conversation[]> {
  await delay()
  return getConversations()
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  await delay()
  return getConversation(id) ?? null
}

export async function sendChatMessage(conversationId: string, text: string): Promise<ChatMessage> {
  await delay(150)
  const clientMessage: ChatMessage = { id: generateMsgId(), from: 'cliente', text, ts: new Date().toISOString() }
  appendMessage(conversationId, clientMessage)

  const conversation = getConversation(conversationId)
  if (conversation?.orderId) {
    await delay(700)
    const reply: ChatMessage = {
      id: generateMsgId(),
      from: 'conductor',
      text: pickScriptedReply(text),
      ts: new Date().toISOString(),
    }
    appendMessage(conversationId, reply)
    pushNotification('chat', `${conversation.title} te escribió`, reply.text)
  }

  return clientMessage
}

export async function sendAdminMessage(conversationId: string, text: string, from: ChatSender): Promise<ChatMessage> {
  await delay(150)
  const conversation = getConversation(conversationId)
  const message: ChatMessage = { id: generateMsgId(), from, text, ts: new Date().toISOString() }
  appendMessage(conversationId, message)
  pushNotification('chat', conversation ? `${conversation.title} respondió` : 'Nuevo mensaje', text)
  return message
}
