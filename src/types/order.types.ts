import type { QuoteItem } from './quote.types'

export type OrderStatus = 'cotizando' | 'aceptado' | 'preparacion' | 'enviado' | 'en_camino' | 'entregado'

export interface OrderTimelineStep {
  status: OrderStatus
  label: string
  date: string | null
  done: boolean
}

export interface RoutePoint {
  lat: number
  lng: number
}

export interface OrderNovedad {
  date: string
  text: string
}

export interface DriverInfo {
  name: string
  plate: string
  phone: string
  vehicle: string
  avatarInitials: string
}

export interface Order {
  id: string
  createdAt: string
  status: OrderStatus
  items: QuoteItem[]
  timeline: OrderTimelineStep[]
  novedades: OrderNovedad[]
  rated: boolean
  deliveryEta?: string
  destinationAddress?: string
  projectName?: string
  pod?: {
    recipientName: string
    recipientDoc: string
    deliveredAt: string
    signatureUrl?: string
    photoUrl?: string
    notes?: string
  }
}
