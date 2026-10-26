import type { OrderStatus, OrderTimelineStep } from '@/types/order.types'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  cotizando: 'Cotizando',
  aceptado: 'Aceptado',
  preparacion: 'En preparación',
  enviado: 'Enviado',
  en_camino: 'En camino',
  entregado: 'Entregado',
}

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  cotizando: 'Tu solicitud está siendo cotizada por nuestro equipo.',
  aceptado: 'La proforma fue aceptada y el pedido quedó confirmado.',
  preparacion: 'Estamos alistando tus productos en bodega.',
  enviado: 'Tu pedido salió de bodega rumbo al destino.',
  en_camino: 'El conductor va en camino hacia tu dirección.',
  entregado: 'Pedido entregado y recibido conforme.',
}

export const ORDER_STATUS_BADGE: Record<OrderStatus, 'default' | 'red' | 'dark' | 'outline'> = {
  cotizando: 'outline',
  aceptado: 'default',
  preparacion: 'default',
  enviado: 'dark',
  en_camino: 'red',
  entregado: 'default',
}

// Color del borde izquierdo en listas de pedidos: refuerza el mismo estado que el badge,
// pero en progresión de izquierda a derecha (neutro -> en tránsito -> entregado).
export const ORDER_STATUS_ACCENT: Record<OrderStatus, string> = {
  cotizando: 'border-l-brand-border',
  aceptado: 'border-l-brand-dark/25',
  preparacion: 'border-l-brand-dark/50',
  enviado: 'border-l-brand-dark',
  en_camino: 'border-l-brand-red',
  entregado: 'border-l-emerald-500',
}

const STATUS_ORDER: OrderStatus[] = ['cotizando', 'aceptado', 'preparacion', 'enviado', 'en_camino', 'entregado']

export function getOrderProgressPercent(status: OrderStatus): number {
  const index = STATUS_ORDER.indexOf(status)
  return Math.round((index / (STATUS_ORDER.length - 1)) * 100)
}

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  const index = STATUS_ORDER.indexOf(status)
  return index < STATUS_ORDER.length - 1 ? STATUS_ORDER[index + 1] : null
}

// Reconstruye el timeline al avanzar/retroceder el estado desde el backoffice: conserva fechas
// ya registradas para pasos cumplidos y limpia los pasos que quedan por delante del nuevo estado.
export function buildTimelineForStatus(
  previousTimeline: OrderTimelineStep[],
  newStatus: OrderStatus,
  nowIso: string
): OrderTimelineStep[] {
  const newIndex = STATUS_ORDER.indexOf(newStatus)
  return previousTimeline.map((step) => {
    const stepIndex = STATUS_ORDER.indexOf(step.status)
    if (stepIndex > newIndex) return { ...step, done: false, date: null }
    return { ...step, done: true, date: step.date ?? nowIso }
  })
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatOrderDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-EC', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeDate(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return 'justo ahora'
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffH = Math.round(diffMin / 60)
  if (diffH < 24) return `hace ${diffH} h`
  const diffD = Math.round(diffH / 24)
  if (diffD < 30) return `hace ${diffD} d`
  return formatOrderDate(iso)
}
