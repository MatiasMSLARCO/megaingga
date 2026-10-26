import type { Order, OrderStatus } from '@/types/order.types'
import type { PortalQuote, PortalQuoteStatus, QuoteItem } from '@/types/quote.types'
import type { Rating } from '@/types/rating.types'
import type { AppNotification, NotificationType } from '@/types/notification.types'
import type { Conversation, ChatMessage } from '@/types/chat.types'
import { ordersMock } from '@/data/orders.mock'
import { portalQuotesMock } from '@/data/quotes.mock'
import { notificationsMock } from '@/data/notifications.mock'
import { driverMock, DRIVER_CHAT_SCRIPT } from '@/data/driver.mock'
import { ORDER_STATUS_LABELS, buildTimelineForStatus } from '@/lib/orderStatus'
import { QUOTE_STATUS_LABELS } from '@/lib/quoteStatus'

const STORAGE_KEY = 'megaingga_portal'

interface PortalState {
  orders: Order[]
  quotes: PortalQuote[]
  ratings: Rating[]
  notifications: AppNotification[]
  conversations: Conversation[]
}

function seedConversations(): Conversation[] {
  return [
    {
      id: 'conv-driver',
      title: driverMock.name,
      subtitle: `Conductor · ${driverMock.vehicle}`,
      avatarInitials: driverMock.avatarInitials,
      orderId: 'PED-2026-1042',
      messages: [
        { id: 'm1', from: 'conductor', text: DRIVER_CHAT_SCRIPT.hola, ts: '2026-10-26T08:12:00-05:00' },
      ],
    },
    {
      id: 'conv-soporte',
      title: 'Soporte MegaIngga',
      subtitle: 'Atención al cliente',
      avatarInitials: 'MS',
      messages: [
        {
          id: 'm2',
          from: 'soporte',
          text: 'Hola, somos el equipo de soporte MegaIngga. ¿En qué podemos ayudarte?',
          ts: '2026-10-15T09:00:00-05:00',
        },
      ],
    },
  ]
}

function seedRatings(): Rating[] {
  return [
    {
      orderId: 'PED-2026-0988',
      criteria: { calidadProducto: 5, tiempoEnvio: 4, atencion: 5, embalaje: 5 },
      comentario: 'Excelente atención y producto conforme a lo cotizado.',
      createdAt: '2026-10-07T12:00:00-05:00',
    },
    {
      orderId: 'PED-2026-0975',
      criteria: { calidadProducto: 5, tiempoEnvio: 5, atencion: 4, embalaje: 4 },
      comentario: 'Entrega puntual, buen embalaje.',
      createdAt: '2026-09-30T13:00:00-05:00',
    },
    {
      orderId: 'PED-2026-0960',
      criteria: { calidadProducto: 4, tiempoEnvio: 4, atencion: 5, embalaje: 4 },
      comentario: 'Todo correcto, volveríamos a comprar.',
      createdAt: '2026-09-16T14:00:00-05:00',
    },
    {
      orderId: 'PED-2026-0945',
      criteria: { calidadProducto: 5, tiempoEnvio: 5, atencion: 5, embalaje: 5 },
      comentario: 'Servicio impecable de principio a fin.',
      createdAt: '2026-09-01T12:30:00-05:00',
    },
  ]
}

function defaultState(): PortalState {
  return {
    orders: ordersMock,
    quotes: portalQuotesMock,
    ratings: seedRatings(),
    notifications: notificationsMock,
    conversations: seedConversations(),
  }
}

function loadState(): PortalState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PortalState
      // Sincroniza novedades y ruta del pedido demo si existía en localStorage previo
      if (parsed.orders) {
        const demoOrder = ordersMock.find((m) => m.id === 'PED-2026-1042')
        if (demoOrder) {
          parsed.orders = parsed.orders.map((o) => {
            if (o.id === 'PED-2026-1042') {
              return {
                ...o,
                destinationAddress: demoOrder.destinationAddress,
                projectName: demoOrder.projectName,
                novedades: demoOrder.novedades,
              }
            }
            return o
          })
        }
      }
      return parsed
    }
  } catch {
    // ignora storage corrupto, recae en el estado semilla
  }
  return defaultState()
}

let state: PortalState = loadState()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // almacenamiento no disponible (modo privado, cuota excedida, etc.)
  }
}

function generateId(prefix: string): string {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
}

function generateUniqueId(prefix: string, existingIds: string[]): string {
  let id = generateId(prefix)
  while (existingIds.includes(id)) {
    id = generateId(prefix)
  }
  return id
}

export function getOrders(): Order[] {
  return state.orders
}

export function getOrder(id: string): Order | undefined {
  return state.orders.find((o) => o.id === id)
}

export function setOrderRated(orderId: string, rating: Rating): void {
  state.orders = state.orders.map((o) => (o.id === orderId ? { ...o, rated: true } : o))
  state.ratings = [...state.ratings, rating]
  persist()
}

export function getRating(orderId: string): Rating | undefined {
  return state.ratings.find((r) => r.orderId === orderId)
}

export function getAllRatings(): Rating[] {
  return state.ratings
}

export function advanceOrderStatus(orderId: string, status: OrderStatus): void {
  const nowIso = new Date().toISOString()
  state.orders = state.orders.map((o) => {
    if (o.id !== orderId) return o
    return {
      ...o,
      status,
      timeline: buildTimelineForStatus(o.timeline, status, nowIso),
      novedades: [{ date: nowIso, text: `Pedido actualizado a "${ORDER_STATUS_LABELS[status]}".` }, ...o.novedades],
    }
  })
  persist()
  pushNotification('pedido', 'Actualización de tu pedido', `${orderId} cambió a estado "${ORDER_STATUS_LABELS[status]}".`)
}

export function getQuotes(): PortalQuote[] {
  return state.quotes
}

export function setQuoteStatus(id: string, status: PortalQuoteStatus): void {
  state.quotes = state.quotes.map((q) => (q.id === id ? { ...q, status } : q))
  persist()
  pushNotification('cotizacion', 'Actualización de cotización', `${id} cambió a estado "${QUOTE_STATUS_LABELS[status]}".`)
}

export function addQuote(
  items: QuoteItem[],
  details?: { projectName?: string; requiredDate?: string; notes?: string }
): PortalQuote {
  // Clona los items a una estructura de datos independiente (JSON-safe): al repetir una cotización
  // ya existente, la nueva queda desacoplada del arreglo original y no se ve afectada por cambios futuros.
  const clonedItems: QuoteItem[] = structuredClone(items)
  const quote: PortalQuote = {
    id: generateUniqueId('RFQ-2026', state.quotes.map((q) => q.id)),
    items: clonedItems,
    totalItemsCount: clonedItems.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: new Date().toISOString(),
    status: 'pendiente',
    projectName: details?.projectName,
    requiredDate: details?.requiredDate,
    notes: details?.notes,
  }
  state.quotes = [quote, ...state.quotes]
  persist()
  return quote
}

export function approveQuoteToOrder(quoteId: string): Order | undefined {
  const quote = state.quotes.find((q) => q.id === quoteId)
  if (!quote) return undefined

  setQuoteStatus(quoteId, 'completada')
  const newOrderId = generateUniqueId('PED-2026', state.orders.map((o) => o.id))
  const nowIso = new Date().toISOString()
  const newOrder: Order = {
    id: newOrderId,
    createdAt: nowIso,
    status: 'preparacion',
    items: structuredClone(quote.items),
    timeline: buildTimelineForStatus([], 'preparacion', nowIso),
    novedades: [{ date: nowIso, text: `Pedido originado por aprobación de cotización ${quoteId}.` }],
    rated: false,
    deliveryEta: 'Mañana 11:00 AM',
    destinationAddress: quote.projectName ? `Obra: ${quote.projectName}, Quito` : 'Av. Amazonas y República, Quito',
    projectName: quote.projectName ?? 'Suministro Obra Directa',
  }
  state.orders = [newOrder, ...state.orders]
  persist()
  pushNotification('pedido', '¡Pedido confirmado!', `Se generó el pedido ${newOrderId} a partir de tu cotización.`)
  return newOrder
}

export function addOrderIncident(orderId: string, tipo: string, detalle: string): void {
  const nowIso = new Date().toISOString()
  state.orders = state.orders.map((o) => {
    if (o.id !== orderId) return o
    return {
      ...o,
      novedades: [
        { date: nowIso, text: `Reporte de obra (${tipo}): ${detalle}` },
        ...o.novedades,
      ],
    }
  })
  persist()
  pushNotification(
    'pedido',
    'Novedad registrada',
    `Tu reporte sobre el pedido ${orderId} fue enviado a nuestro equipo técnico.`
  )
}

export function getNotifications(): AppNotification[] {
  return state.notifications
}

export function markNotificationRead(id: string): void {
  state.notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  persist()
}

export function markAllNotificationsRead(): void {
  state.notifications = state.notifications.map((n) => ({ ...n, read: true }))
  persist()
}

export function pushNotification(type: NotificationType, title: string, text: string): AppNotification {
  const notification: AppNotification = {
    id: generateId('notif'),
    type,
    title,
    text,
    ts: new Date().toISOString(),
    read: false,
  }
  state.notifications = [notification, ...state.notifications]
  persist()
  return notification
}

export function getConversations(): Conversation[] {
  return state.conversations
}

export function getConversation(id: string): Conversation | undefined {
  return state.conversations.find((c) => c.id === id)
}

export function appendMessage(conversationId: string, message: ChatMessage): void {
  state.conversations = state.conversations.map((c) =>
    c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
  )
  persist()
}
