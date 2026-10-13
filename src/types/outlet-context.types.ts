import type { Product } from './product.types'
import type { QuoteItem } from './quote.types'

export interface AppOutletContext {
  addToQuote: (product: Product, quantity?: number) => void
  onBuyNow: (product: Product, quantity: number) => void
  openQuote: () => void
  items: QuoteItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
}

