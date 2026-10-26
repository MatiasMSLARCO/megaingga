import type { Product } from './product.types'

export interface QuoteItem {
  productId: string
  product: Product
  quantity: number
  customNotes?: string
}

export interface QuoteCustomerData {
  fullName: string
  companyName: string
  email: string
  phone: string
  cityOrProjectLocation: string
  projectScopeNotes?: string
}

export interface QuoteRequest {
  id: string
  customer: QuoteCustomerData
  items: QuoteItem[]
  totalItemsCount: number
  createdAt: string
  status: 'draft' | 'generated' | 'sent_whatsapp'
}

export type PortalQuoteStatus = 'pendiente' | 'activa' | 'completada'

export interface PortalQuote {
  id: string
  items: QuoteItem[]
  totalItemsCount: number
  createdAt: string
  status: PortalQuoteStatus
  projectName?: string
  requiredDate?: string
  notes?: string
}
