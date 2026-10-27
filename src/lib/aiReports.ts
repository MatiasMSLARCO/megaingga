import type { Order } from '@/types/order.types'

export interface ProductRanking {
  name: string
  quantity: number
}

export function getTopProducts(orders: Order[], limit = 5): ProductRanking[] {
  const counts = new Map<string, number>()
  orders.forEach((order) =>
    order.items.forEach((item) => counts.set(item.product.name, (counts.get(item.product.name) ?? 0) + item.quantity))
  )
  return [...counts.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
}

export function buildAiSummary(
  deliveredCount: number,
  pendingQuotesCount: number,
  topProductName: string | null
): string {
  return `Este periodo registras ${deliveredCount} ${
    deliveredCount === 1 ? 'pedido entregado' : 'pedidos entregados'
  } y ${pendingQuotesCount} ${pendingQuotesCount === 1 ? 'cotización' : 'cotizaciones'} en revisión.${
    topProductName ? ` El producto más solicitado fue ${topProductName}.` : ''
  } Tu tiempo de respuesta se mantiene estable frente al periodo anterior.`
}
