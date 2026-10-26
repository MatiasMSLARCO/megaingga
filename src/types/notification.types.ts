export type NotificationType = 'pedido' | 'cotizacion' | 'envio' | 'calificacion' | 'chat'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  text: string
  ts: string
  read: boolean
}
