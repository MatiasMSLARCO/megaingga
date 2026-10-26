import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck, Package, FileText, Truck, Star, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/hooks/useNotifications'
import type { NotificationType } from '@/types/notification.types'

const TYPE_ICON: Record<NotificationType, typeof Package> = {
  pedido: Package,
  cotizacion: FileText,
  envio: Truck,
  calificacion: Star,
  chat: MessageCircle,
}

function formatRelative(ts: string): string {
  const diffMs = Date.now() - new Date(ts).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'ahora'
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `hace ${diffH} h`
  const diffD = Math.floor(diffH / 24)
  return `hace ${diffD} d`
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: notifications = [] } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notificaciones"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-dark transition-colors hover:bg-black/5 cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-brand-border-soft bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-brand-border-soft px-4 py-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-brand-dark">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-gray hover:text-brand-red cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todo leído
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-xs text-brand-gray">Sin notificaciones por ahora.</p>
            )}
            {notifications.map((notification) => {
              const Icon = TYPE_ICON[notification.type]
              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markRead.mutate(notification.id)}
                  className={cn(
                    'flex w-full items-start gap-3 border-b border-brand-border-soft/60 px-4 py-3 text-left transition-colors hover:bg-black/[0.03] cursor-pointer',
                    !notification.read && 'bg-brand-red/[0.04]'
                  )}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-border-soft text-brand-dark">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold text-brand-dark">{notification.title}</span>
                    <span className="mt-0.5 block text-xs text-brand-gray">{notification.text}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-wide text-brand-gray/70">
                      {formatRelative(notification.ts)}
                    </span>
                  </span>
                  {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-red" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
