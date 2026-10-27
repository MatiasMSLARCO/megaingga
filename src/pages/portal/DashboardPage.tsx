import { Link } from 'react-router'
import {
  Package,
  FileText,
  MessageCircle,
  ArrowRight,
  Star,
  Clock3,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/portal/StarRating'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useOrders } from '@/hooks/useOrders'
import { useQuotes } from '@/hooks/useQuotes'
import { useRating } from '@/hooks/useRatings'
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABELS, formatOrderDate, formatRelativeDate, getOrderProgressPercent } from '@/lib/orderStatus'
import { averageRating } from '@/lib/rating'
import { buildAiSummary, getTopProducts } from '@/lib/aiReports'
import type { Order } from '@/types/order.types'

function itemsSummary(order: Order): string {
  return order.items.map((item) => `${item.quantity}x ${item.product.name}`).join(', ')
}

function RatedOrderCard({ order }: { order: Order }) {
  const { data: rating } = useRating(order.id)

  return (
    <Card className="flex flex-col gap-3 p-4 transition-all hover:border-brand-red/30 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">{order.id}</p>
            {order.projectName && (
              <span className="truncate max-w-[150px] text-[10px] text-brand-gray" title={order.projectName}>
                · {order.projectName}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-brand-gray">{formatOrderDate(order.createdAt)}</p>
        </div>
        <Badge variant="default" className="bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 shrink-0">
          Entregado
        </Badge>
      </div>

      <p className="line-clamp-2 text-xs text-brand-gray">{itemsSummary(order)}</p>

      <div className="mt-auto border-t border-brand-border-soft pt-3">
        {rating ? (
          <div className="flex items-center gap-2">
            <StarRating value={averageRating(rating.criteria)} readOnly size="sm" />
            <span className="text-xs font-semibold text-brand-dark">
              {averageRating(rating.criteria)}/5
            </span>
          </div>
        ) : (
          <Link to={`/portal/pedidos/${order.id}/calificar`} className="block w-full">
            <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              Calificar pedido
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const { session } = useAuth()
  const { toast } = useToast()
  const { data: orders = [], isLoading, isError } = useOrders()
  const { data: quotes = [] } = useQuotes()

  const activeOrder = orders.find((o) => o.status !== 'entregado')
  const deliveredOrders = orders.filter((o) => o.status === 'entregado')
  const pendingToRate = deliveredOrders.filter((o) => !o.rated).length
  const activeOrdersCount = orders.filter((o) => o.status !== 'entregado').length
  const pendingQuotesCount = quotes.filter((q) => q.status !== 'completada').length
  const activeQuotesCount = quotes.filter((q) => q.status === 'activa').length

  const topProduct = getTopProducts(orders, 1)[0]?.name ?? null
  const aiSummary = buildAiSummary(deliveredOrders.length, pendingQuotesCount, topProduct)

  const handleGenerateReport = () => {
    toast({
      title: 'Generando reporte con IA',
      description: 'Estamos analizando tu historial de pedidos y cotizaciones. Te avisaremos cuando esté listo.',
      variant: 'info',
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark">
          ¡Bienvenido, {session?.user.fullName}!
        </h1>
        <p className="mt-1 text-sm text-brand-gray">
          {session?.user.companyName} · Panel de control logístico
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex h-11 items-center justify-center rounded-full bg-brand-gray/10 p-5">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-3 text-xs text-brand-gray">Cargando...</span>
          </Card>
          <Card className="flex h-11 items-center justify-center rounded-full bg-brand-gray/10 p-5">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-3 text-xs text-brand-gray">Cargando...</span>
          </Card>
          <Card className="flex h-11 items-center justify-center rounded-full bg-brand-gray/10 p-5">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-3 text-xs text-brand-gray">Cargando...</span>
          </Card>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-brand-red/20 bg-brand-red/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-brand-red" />
          <p className="text-sm text-brand-red">Error al cargar el panel. Inténtalo de nuevo.</p>
        </div>
      )}

      {/* Mini stats */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5 hover:shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-brand-dark">{activeOrdersCount}</p>
              <p className="text-xs text-brand-gray">Pedidos en proceso</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5 hover:shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-dark/10 text-brand-dark">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-brand-dark">{pendingQuotesCount}</p>
              <p className="text-xs text-brand-gray">Cotizaciones pendientes</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5 hover:shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
              <Star className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-brand-dark">{pendingToRate}</p>
              <p className="text-xs text-brand-gray">Por calificar</p>
            </div>
          </Card>
        </div>
      )}

      {/* Reportes con IA */}
      {!isLoading && !isError && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wide text-brand-gray">Reportes con IA</h2>
              <Badge variant="outline" className="text-[10px]">
                Beta
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/portal/reportes" className="text-xs font-semibold text-brand-red hover:underline">
                Ver reporte completo
              </Link>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleGenerateReport}>
                <Sparkles className="h-3.5 w-3.5" />
                Generar reporte
              </Button>
            </div>
          </div>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-brand-dark">Resumen de tu actividad</p>
                <p className="mt-1 text-xs leading-relaxed text-brand-gray">{aiSummary}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-brand-border-soft p-3.5">
                <p className="text-xl font-bold text-brand-dark">{deliveredOrders.length}</p>
                <p className="mt-0.5 text-[11px] text-brand-gray">Pedidos entregados</p>
              </div>
              <div className="rounded-lg border border-brand-border-soft p-3.5">
                <p className="text-xl font-bold text-brand-dark">{activeQuotesCount}</p>
                <p className="mt-0.5 text-[11px] text-brand-gray">Cotizaciones activas</p>
              </div>
              <div className="min-w-0 rounded-lg border border-brand-border-soft p-3.5">
                <p className="truncate text-xl font-bold text-brand-dark" title={topProduct ?? undefined}>
                  {topProduct ?? '—'}
                </p>
                <p className="mt-0.5 text-[11px] text-brand-gray">Producto más pedido</p>
              </div>
              <div className="rounded-lg border border-brand-border-soft p-3.5">
                <p className="text-xl font-bold text-brand-dark">94%</p>
                <p className="mt-0.5 text-[11px] text-brand-gray">Entregas a tiempo (IA)</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Atajo: tu pedido activo */}
      {!isLoading && !isError && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-brand-gray">Tu Pedido en Proceso</h2>
            <Link to="/portal/pedidos" className="text-xs font-semibold text-brand-red hover:underline">
              Ver todos ({orders.length})
            </Link>
          </div>
          {activeOrder ? (
            <Link to={`/portal/pedidos/${activeOrder.id}`} className="block">
              <Card className="group flex flex-col gap-4 p-5 transition-all hover:border-brand-red/40 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
                    <Package className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-brand-dark">{activeOrder.id}</p>
                      {activeOrder.projectName && (
                        <span className="rounded-full bg-brand-dark/5 px-2 py-0.5 text-[11px] font-semibold text-brand-gray">
                          {activeOrder.projectName}
                        </span>
                      )}
                      <Badge variant={ORDER_STATUS_BADGE[activeOrder.status]}>
                        {ORDER_STATUS_LABELS[activeOrder.status]}
                      </Badge>
                      {activeOrder.deliveryEta && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                          ETA {activeOrder.deliveryEta}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-brand-gray">{formatOrderDate(activeOrder.createdAt)}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-brand-gray">{itemsSummary(activeOrder)}</p>

                    {/* Stepper Progress Bar */}
                    <div className="mt-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] max-w-md">
                        <span className="font-semibold text-brand-dark">
                          Estado: <span className="text-brand-red">{ORDER_STATUS_LABELS[activeOrder.status]}</span>
                        </span>
                        <span className="font-bold text-brand-gray">{getOrderProgressPercent(activeOrder.status)}%</span>
                      </div>
                      <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-brand-border-soft">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-red to-rose-500 transition-all duration-700"
                          style={{ width: `${getOrderProgressPercent(activeOrder.status)}%` }}
                        />
                      </div>
                      <div className="flex max-w-md justify-between text-[10px] text-brand-gray/80 pt-0.5">
                        <span>Recibido</span>
                        <span>Preparación</span>
                        <span className={activeOrder.status === 'en_camino' ? 'font-bold text-brand-red' : ''}>En ruta GPS</span>
                        <span>Entregado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 sm:self-center">
                  <Button size="sm" variant="outline" className="gap-1.5 group-hover:border-brand-red group-hover:text-brand-red">
                    Ver seguimiento
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </Link>
          ) : (
            <Card className="flex items-center gap-3 p-5 text-sm text-brand-gray">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              No tienes pedidos activos en este momento.
            </Card>
          )}
        </div>
      )}

      {/* Pedidos anteriores calificables */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wide text-brand-gray">
            Pedidos Anteriores · Califica tu experiencia
          </h2>
          <Link to="/portal/pedidos" className="text-xs font-semibold text-brand-red hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deliveredOrders.map((order) => (
            <RatedOrderCard key={order.id} order={order} />
          ))}
          {/* Empty state when no delivered orders */}
          {!deliveredOrders.length && (
            <Card
              className="flex items-center gap-3 p-5 text-sm text-brand-gray border-dashed border-brand-border/20"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Aún no has completado ningún pedido.</span>
            </Card>
          )}
        </div>
      </div>

      {/* Última actividad */}
      {!isLoading && !isError && activeOrder && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-brand-gray">
              Últimos Hitos de Ruta ({activeOrder.id})
            </h2>
            <Link to={`/portal/pedidos/${activeOrder.id}`} className="text-xs font-semibold text-brand-red hover:underline">
              Ver bitácora completa ({activeOrder.novedades.length})
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {activeOrder.novedades.slice(0, 3).map((novedad, index) => (
              <Card key={novedad.date} className="p-3.5 flex flex-col justify-between gap-2 shadow-xs bg-white">
                <div className="flex items-start gap-2">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${index === 0 ? 'bg-brand-red' : 'bg-brand-border'}`} />
                  <p className="text-xs font-medium text-brand-dark line-clamp-2">{novedad.text}</p>
                </div>
                <p className="text-[10px] text-brand-gray/80 font-mono text-right">
                  {formatRelativeDate(novedad.date)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Accesos rápidos */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-gray">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link to="/portal/cotizaciones/crear" className="group">
            <Card className="flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand-red" />
                <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-red">
                  Crear cotización
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-brand-gray transition-transform group-hover:translate-x-1 group-hover:text-brand-red" />
            </Card>
          </Link>
          <Link to="/portal/pedidos" className="group">
            <Card className="flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-brand-red" />
                <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-red">
                  Historial de Pedidos
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-brand-gray transition-transform group-hover:translate-x-1 group-hover:text-brand-red" />
            </Card>
          </Link>
          <Link to="/portal/chat" className="group">
            <Card className="flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-brand-red" />
                <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-red">
                  Chat con Soporte y Conductor
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-brand-gray transition-transform group-hover:translate-x-1 group-hover:text-brand-red" />
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
