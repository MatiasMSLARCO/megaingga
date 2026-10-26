import { Link } from 'react-router'
import { Clock3, FileText, MessageCircle, Package, Star, Bell } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useOrders } from '@/hooks/useOrders'
import { useQuotes } from '@/hooks/useQuotes'
import { useRatingsList } from '@/hooks/useRatings'
import { useConversations } from '@/hooks/useChat'
import { useNotifications } from '@/hooks/useNotifications'
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABELS, formatRelativeDate } from '@/lib/orderStatus'
import { averageRating } from '@/lib/rating'

export function BackofficeDashboardPage() {
  const { data: orders = [] } = useOrders()
  const { data: quotes = [] } = useQuotes()
  const { data: ratings = [] } = useRatingsList()
  const { data: conversations = [] } = useConversations()
  const { data: notifications = [] } = useNotifications()

  const activeOrdersCount = orders.filter((o) => o.status !== 'entregado').length
  const pendingQuotesCount = quotes.filter((q) => q.status === 'pendiente').length
  const unansweredCount = conversations.filter((c) => {
    const last = c.messages[c.messages.length - 1]
    return last?.from === 'cliente'
  }).length
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((sum, r) => sum + averageRating(r.criteria), 0) / ratings.length) * 10) / 10
    : null

  const recentOrders = [...orders].slice(0, 5)
  const recentNotifications = notifications.slice(0, 6)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark">Panel de Operaciones</h1>
        <p className="mt-1 text-sm text-brand-gray">Resumen de pedidos, cotizaciones y comunicación con clientes.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
            <Clock3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-bold text-brand-dark">{activeOrdersCount}</p>
            <p className="text-xs text-brand-gray">Pedidos activos</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-dark/10 text-brand-dark">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-bold text-brand-dark">{pendingQuotesCount}</p>
            <p className="text-xs text-brand-gray">Cotizaciones pendientes</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-bold text-brand-dark">{unansweredCount}</p>
            <p className="text-xs text-brand-gray">Conversaciones sin responder</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <Star className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-bold text-brand-dark">{avgRating ?? '—'}</p>
            <p className="text-xs text-brand-gray">Calificación promedio</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-brand-gray">Pedidos recientes</h2>
            <Link to="/backoffice/pedidos" className="text-xs font-semibold text-brand-red hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentOrders.map((order) => (
              <Card key={order.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-border-soft text-brand-dark">
                    <Package className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{order.id}</p>
                    <p className="text-xs text-brand-gray">{order.items.length} productos</p>
                  </div>
                </div>
                <Badge variant={ORDER_STATUS_BADGE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
              </Card>
            ))}
            {recentOrders.length === 0 && (
              <Card className="p-5 text-center text-sm text-brand-gray">No hay pedidos registrados.</Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-gray">Actividad reciente</h2>
          <Card className="flex flex-col divide-y divide-brand-border-soft p-0">
            {recentNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-border-soft text-brand-dark">
                  <Bell className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-bold text-brand-dark">{n.title}</p>
                  <p className="line-clamp-2 text-xs text-brand-gray">{n.text}</p>
                  <p className="mt-0.5 text-[10px] text-brand-gray/70">{formatRelativeDate(n.ts)}</p>
                </div>
              </div>
            ))}
            {recentNotifications.length === 0 && (
              <p className="p-5 text-center text-sm text-brand-gray">Sin actividad reciente.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
