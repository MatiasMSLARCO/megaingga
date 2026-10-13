import type { Product } from './product.types'

export interface AppOutletContext {
  addToQuote: (product: Product, quantity?: number) => void
  openQuote: () => void
}
