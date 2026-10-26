import type { Order } from '@/types/order.types'
import type { PortalQuote, PortalQuoteStatus, QuoteItem } from '@/types/quote.types'
import { delay } from './delay'
import { addQuote, approveQuoteToOrder, getQuotes, pushNotification, setQuoteStatus } from './portalStore'

export async function getPortalQuotes(): Promise<PortalQuote[]> {
  await delay()
  return [...getQuotes()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function createPortalQuote(
  items: QuoteItem[],
  details?: { projectName?: string; requiredDate?: string; notes?: string }
): Promise<PortalQuote> {
  await delay()
  const quote = addQuote(items, details)
  pushNotification('cotizacion', 'Cotización generada', `Tu cotización ${quote.id} quedó pendiente de revisión.`)
  return quote
}

export async function updateQuoteStatus(id: string, status: PortalQuoteStatus): Promise<void> {
  await delay(300)
  setQuoteStatus(id, status)
}

export async function approveQuote(quoteId: string): Promise<Order | undefined> {
  await delay(400)
  return approveQuoteToOrder(quoteId)
}
