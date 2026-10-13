import type { QuoteItem } from '@/types/quote.types'
import type { CardDetails, PaymentResult } from '@/types/payment.types'
import { delay } from './delay'

// Demo únicamente: el modelo B2B real es RFQ sin tarifario público, por lo que no
// existe un precio real que mostrar aquí. Esta tarifa plana por división es solo
// para simular un monto en la pasarela de pago ficticia de "Comprar Ahora".
const DEMO_UNIT_PRICE: Record<string, number> = {
  hospitalario: 480,
  climatizacion: 650,
  especiales: 820,
}

export function estimateUnitPrice(division: string): number {
  return DEMO_UNIT_PRICE[division] ?? 500
}

export function calculateOrderTotal(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + estimateUnitPrice(item.product.division) * item.quantity, 0)
}

export function validateCard(card: CardDetails): string | null {
  // En modo demo todo es válido para facilitar pruebas inmediatas
  const digits = card.cardNumber.replace(/\s/g, '')
  if (digits.length < 4) {
    return 'Ingresa al menos 4 dígitos para la tarjeta de prueba.'
  }
  return null
}

export async function processPayment(items: QuoteItem[], card: CardDetails): Promise<PaymentResult> {
  const error = validateCard(card)
  if (error) throw new Error(error)

  await delay(800)

  const digits = card.cardNumber.replace(/\s/g, '')
  const last4 = digits.length >= 4 ? digits.slice(-4) : '4535'

  return {
    orderId: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: calculateOrderTotal(items),
    last4,
  }
}
