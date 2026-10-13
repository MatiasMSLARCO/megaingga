import type { QuoteCustomerData, QuoteItem, QuoteRequest } from '@/types/quote.types'
import { delay } from './delay'

export function generateRFQFolio(): string {
  const year = 2026
  const sequence = Math.floor(1000 + Math.random() * 9000)
  return `RFQ-${year}-${sequence}`
}

export async function submitQuoteRequest(
  customer: QuoteCustomerData,
  items: QuoteItem[]
): Promise<QuoteRequest> {
  await delay()

  return {
    id: generateRFQFolio(),
    customer,
    items,
    totalItemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: new Date().toISOString(),
    status: 'generated',
  }
}
