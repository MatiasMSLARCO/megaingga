import type { Order, OrderTimelineStep } from '@/types/order.types'
import { productsMock } from '@/data/products.mock'

function product(id: string) {
  const found = productsMock.find((p) => p.id === id)
  if (!found) throw new Error(`Producto mock no encontrado: ${id}`)
  return found
}

function fullTimeline(upTo: Order['status'], dates: Partial<Record<Order['status'], string>>): OrderTimelineStep[] {
  const order: { status: Order['status']; label: string }[] = [
    { status: 'cotizando', label: 'Cotizando' },
    { status: 'aceptado', label: 'Aceptado' },
    { status: 'preparacion', label: 'En preparación' },
    { status: 'enviado', label: 'Enviado' },
    { status: 'en_camino', label: 'En camino' },
    { status: 'entregado', label: 'Entregado' },
  ]
  const upToIndex = order.findIndex((s) => s.status === upTo)
  return order.map((step, index) => ({
    status: step.status,
    label: step.label,
    date: dates[step.status] ?? null,
    done: index <= upToIndex,
  }))
}

export const ordersMock: Order[] = [
  {
    id: 'PED-2026-1042',
    createdAt: '2026-10-24T09:15:00-05:00',
    status: 'en_camino',
    items: [
      { productId: 'prod-04', product: product('prod-04'), quantity: 2 },
      { productId: 'prod-02', product: product('prod-02'), quantity: 6 },
    ],
    timeline: fullTimeline('en_camino', {
      cotizando: '2026-10-24T09:15:00-05:00',
      aceptado: '2026-10-24T14:40:00-05:00',
      preparacion: '2026-10-25T08:00:00-05:00',
      enviado: '2026-10-26T07:30:00-05:00',
      en_camino: '2026-10-26T08:10:00-05:00',
    }),
    novedades: [
      { date: '2026-10-26T08:45:00-05:00', text: 'Paso por peaje San Andrés / Salcedo con flujo vehicular normal en Panamericana Sur.' },
      { date: '2026-10-26T08:25:00-05:00', text: 'Vehículo Hino 300 (placa PCT-4521) en tránsito por bypass hacia Ambato.' },
      { date: '2026-10-26T08:10:00-05:00', text: 'Salida de despacho registrada. Conductor Luis Chasiquiza activó rastreo satelital.' },
      { date: '2026-10-26T07:45:00-05:00', text: 'Carga asegurada en furgón con precinto de seguridad #MG-8841 e inspección de sujeción.' },
      { date: '2026-10-26T07:30:00-05:00', text: 'Guía de remisión electrónica autorizada por el SRI emitida al transportista.' },
      { date: '2026-10-25T16:30:00-05:00', text: 'Control de calidad técnico y embalaje de viniles hospitalarios completado conforme a norma.' },
      { date: '2026-10-25T08:00:00-05:00', text: 'Pedido ingresado a línea de preparación y despacho en centro logístico Megaingga.' },
    ],
    rated: false,
    deliveryEta: '1 h 40 min',
    destinationAddress: 'Hospital SOLCA Núcleo de Tungurahua, Ambato',
    projectName: 'Obra Hospital SOLCA - Ambato',
  },
  {
    id: 'PED-2026-1020',
    createdAt: '2026-10-18T10:00:00-05:00',
    status: 'entregado',
    projectName: 'Torre Residencial Bellavista - Quito',
    destinationAddress: 'Av. Eloy Alfaro y República, Quito',
    pod: {
      recipientName: 'Ing. Carlos Morales (Jefe de Bodega)',
      recipientDoc: 'CI 1718293041',
      deliveredAt: '2026-10-20T10:45:00-05:00',
      notes: 'Descarga verificada con guía de remisión. Material ingresado en bodega de obra conforme a especificaciones.',
    },
    items: [
      { productId: 'prod-06', product: product('prod-06'), quantity: 3 },
      { productId: 'prod-10', product: product('prod-10'), quantity: 4 },
    ],
    timeline: fullTimeline('entregado', {
      cotizando: '2026-10-18T10:00:00-05:00',
      aceptado: '2026-10-18T16:20:00-05:00',
      preparacion: '2026-10-19T08:00:00-05:00',
      enviado: '2026-10-20T07:00:00-05:00',
      en_camino: '2026-10-20T08:30:00-05:00',
      entregado: '2026-10-20T10:45:00-05:00',
    }),
    novedades: [{ date: '2026-10-20T10:45:00-05:00', text: 'Entregado y recibido conforme en bodega del cliente.' }],
    rated: false,
  },
  {
    id: 'PED-2026-0988',
    createdAt: '2026-10-05T09:00:00-05:00',
    status: 'entregado',
    items: [{ productId: 'prod-13', product: product('prod-13'), quantity: 1 }],
    timeline: fullTimeline('entregado', {
      cotizando: '2026-10-05T09:00:00-05:00',
      aceptado: '2026-10-05T15:00:00-05:00',
      preparacion: '2026-10-06T08:00:00-05:00',
      enviado: '2026-10-07T07:00:00-05:00',
      en_camino: '2026-10-07T08:00:00-05:00',
      entregado: '2026-10-07T11:00:00-05:00',
    }),
    novedades: [{ date: '2026-10-07T11:00:00-05:00', text: 'Entregado conforme.' }],
    rated: true,
  },
  {
    id: 'PED-2026-0975',
    createdAt: '2026-09-28T09:00:00-05:00',
    status: 'entregado',
    items: [
      { productId: 'prod-01', product: product('prod-01'), quantity: 10 },
      { productId: 'prod-03', product: product('prod-03'), quantity: 2 },
    ],
    timeline: fullTimeline('entregado', {
      cotizando: '2026-09-28T09:00:00-05:00',
      aceptado: '2026-09-28T13:00:00-05:00',
      preparacion: '2026-09-29T08:00:00-05:00',
      enviado: '2026-09-30T07:00:00-05:00',
      en_camino: '2026-09-30T08:00:00-05:00',
      entregado: '2026-09-30T12:30:00-05:00',
    }),
    novedades: [{ date: '2026-09-30T12:30:00-05:00', text: 'Entregado conforme.' }],
    rated: true,
  },
  {
    id: 'PED-2026-0960',
    createdAt: '2026-09-14T09:00:00-05:00',
    status: 'entregado',
    items: [{ productId: 'prod-09', product: product('prod-09'), quantity: 1 }],
    timeline: fullTimeline('entregado', {
      cotizando: '2026-09-14T09:00:00-05:00',
      aceptado: '2026-09-14T15:00:00-05:00',
      preparacion: '2026-09-15T08:00:00-05:00',
      enviado: '2026-09-16T07:00:00-05:00',
      en_camino: '2026-09-16T08:00:00-05:00',
      entregado: '2026-09-16T13:15:00-05:00',
    }),
    novedades: [{ date: '2026-09-16T13:15:00-05:00', text: 'Entregado conforme.' }],
    rated: true,
  },
  {
    id: 'PED-2026-0945',
    createdAt: '2026-08-30T09:00:00-05:00',
    status: 'entregado',
    items: [{ productId: 'prod-14', product: product('prod-14'), quantity: 2 }],
    timeline: fullTimeline('entregado', {
      cotizando: '2026-08-30T09:00:00-05:00',
      aceptado: '2026-08-30T15:00:00-05:00',
      preparacion: '2026-08-31T08:00:00-05:00',
      enviado: '2026-09-01T07:00:00-05:00',
      en_camino: '2026-09-01T08:00:00-05:00',
      entregado: '2026-09-01T11:50:00-05:00',
    }),
    novedades: [{ date: '2026-09-01T11:50:00-05:00', text: 'Entregado conforme.' }],
    rated: true,
  },
]
