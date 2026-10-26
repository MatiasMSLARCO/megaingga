import type { PortalQuote } from '@/types/quote.types'
import { productsMock } from '@/data/products.mock'

function product(id: string) {
  const found = productsMock.find((p) => p.id === id)
  if (!found) throw new Error(`Producto mock no encontrado: ${id}`)
  return found
}

export const portalQuotesMock: PortalQuote[] = [
  {
    id: 'RFQ-2026-4821',
    items: [
      { productId: 'prod-04', product: product('prod-04'), quantity: 2 },
      { productId: 'prod-05', product: product('prod-05'), quantity: 1 },
    ],
    totalItemsCount: 3,
    createdAt: '2026-10-22T11:00:00-05:00',
    status: 'activa',
    projectName: 'Proyecto Hidráulico Cumbayá',
  },
  {
    id: 'RFQ-2026-4790',
    items: [{ productId: 'prod-07', product: product('prod-07'), quantity: 1 }],
    totalItemsCount: 1,
    createdAt: '2026-10-10T09:30:00-05:00',
    status: 'completada',
  },
  {
    id: 'RFQ-2026-4762',
    items: [
      { productId: 'prod-01', product: product('prod-01'), quantity: 8 },
      { productId: 'prod-03', product: product('prod-03'), quantity: 2 },
    ],
    totalItemsCount: 10,
    createdAt: '2026-09-25T15:00:00-05:00',
    status: 'completada',
  },
  {
    id: 'RFQ-2026-4701',
    items: [{ productId: 'prod-13', product: product('prod-13'), quantity: 1 }],
    totalItemsCount: 1,
    createdAt: '2026-09-02T10:00:00-05:00',
    status: 'completada',
  },
]
