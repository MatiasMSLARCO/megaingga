import type { PortalQuoteStatus } from '@/types/quote.types'

export const QUOTE_STATUS_LABELS: Record<PortalQuoteStatus, string> = {
  pendiente: 'Pendiente',
  activa: 'Activa',
  completada: 'Completada',
}

export const QUOTE_STATUS_BADGE: Record<PortalQuoteStatus, 'default' | 'red' | 'dark' | 'outline'> = {
  pendiente: 'outline',
  activa: 'red',
  completada: 'default',
}

const QUOTE_STATUS_ORDER: PortalQuoteStatus[] = ['pendiente', 'activa', 'completada']

export function getNextQuoteStatus(status: PortalQuoteStatus): PortalQuoteStatus | null {
  const index = QUOTE_STATUS_ORDER.indexOf(status)
  return index < QUOTE_STATUS_ORDER.length - 1 ? QUOTE_STATUS_ORDER[index + 1] : null
}
