import type { AppNotification } from '@/types/notification.types'

export const notificationsMock: AppNotification[] = [
  {
    id: 'notif-01',
    type: 'envio',
    title: 'Pedido en camino',
    text: 'PED-2026-1042 en ruta Panamericana hacia Hospital SOLCA Ambato.',
    ts: '2026-10-26T08:10:00-05:00',
    read: false,
  },
  {
    id: 'notif-02',
    type: 'calificacion',
    title: 'Califica tu última entrega',
    text: 'PED-2026-1020 fue entregado. Cuéntanos tu experiencia.',
    ts: '2026-10-20T11:00:00-05:00',
    read: false,
  },
  {
    id: 'notif-03',
    type: 'cotizacion',
    title: 'Cotización generada',
    text: 'Tu cotización RFQ-2026-4821 quedó activa.',
    ts: '2026-10-22T11:05:00-05:00',
    read: true,
  },
]
