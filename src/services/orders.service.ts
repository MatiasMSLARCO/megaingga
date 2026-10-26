import type { Order, OrderStatus } from '@/types/order.types'
import { delay } from './delay'
import { addOrderIncident, advanceOrderStatus, getOrder, getOrders } from './portalStore'

export async function getOrdersList(): Promise<Order[]> {
  await delay()
  return [...getOrders()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay()
  return getOrder(id) ?? null
}

export async function advanceOrder(orderId: string, status: OrderStatus): Promise<void> {
  await delay(300)
  advanceOrderStatus(orderId, status)
}

export async function reportIncident(orderId: string, tipo: string, detalle: string): Promise<void> {
  await delay(300)
  addOrderIncident(orderId, tipo, detalle)
}
