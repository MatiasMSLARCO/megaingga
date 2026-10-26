import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Package, ChevronRight, ChevronDown, Clock3, FileText, Search, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ItemsPreviewList } from '@/components/portal/ItemsPreviewList'
import { useOrders } from '@/hooks/useOrders'
import {
  ORDER_STATUS_ACCENT,
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABELS,
  formatOrderDate,
  getOrderProgressPercent,
} from '@/lib/orderStatus'

type FilterTab = 'todos' | 'en_proceso' | 'entregado' | 'calificables'

export function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('todos')

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filtrado por tab
      if (tab === 'en_proceso' && order.status === 'entregado') return false
      if (tab === 'entregado' && order.status !== 'entregado') return false
      if (tab === 'calificables' && (order.status !== 'entregado' || order.rated)) return false

      // Filtrado por texto
      if (!search.trim()) return true
      const q = search.toLowerCase()
      const matchId = order.id.toLowerCase().includes(q)
      const matchProject = order.projectName?.toLowerCase().includes(q)
      const matchProduct = order.items.some((i) => i.product.name.toLowerCase().includes(q))
      return matchId || matchProject || matchProduct
    })
  }, [orders, tab, search])

  const pendingToRateCount = orders.filter((o) => o.status === 'entregado' && !o.rated).length
  const activeOrdersCount = orders.filter((o) => o.status !== 'entregado').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-brand-dark">Pedidos</h1>
          <p className="mt-1 text-sm text-brand-gray">Historial completo de tus pedidos y su estado logístico.</p>
        </div>
        {!isLoading && orders.length > 0 && (
          <p className="text-xs font-semibold text-brand-gray">
            Mostrando {filteredOrders.length} de {orders.length} pedidos
          </p>
        )}
      </div>

      {/* Controles de Búsqueda y Filtros de Estado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, obra o producto..."
            className="h-10 w-full rounded-md border border-brand-border bg-white pl-9 pr-8 text-xs text-brand-dark placeholder:text-brand-gray/60 outline-none transition-colors focus:border-brand-red"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-brand-gray hover:text-brand-dark"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-lg border border-brand-border-soft bg-white p-1">
          <button
            type="button"
            onClick={() => setTab('todos')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'todos' ? 'bg-brand-dark text-white' : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('en_proceso')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'en_proceso' ? 'bg-brand-dark text-white' : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            En proceso ({activeOrdersCount})
          </button>
          <button
            type="button"
            onClick={() => setTab('entregado')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'entregado' ? 'bg-brand-dark text-white' : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            Entregados ({orders.length - activeOrdersCount})
          </button>
          {pendingToRateCount > 0 && (
            <button
              type="button"
              onClick={() => setTab('calificables')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                tab === 'calificables' ? 'bg-amber-600 text-white' : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              Por calificar ({pendingToRateCount})
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-brand-border-soft/60" />
          ))}
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-border-soft text-brand-gray">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-dark">Aún no tienes pedidos</p>
            <p className="mt-1 text-xs text-brand-gray">
              Tus pedidos aparecerán aquí en cuanto se confirme una cotización.
            </p>
          </div>
          <Link to="/portal/cotizaciones/crear">
            <Button size="sm" variant="outline" className="mt-1 gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Crear cotización
            </Button>
          </Link>
        </Card>
      )}

      {!isLoading && orders.length > 0 && filteredOrders.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-8 text-center text-xs text-brand-gray">
          <p className="font-semibold text-brand-dark">No se encontraron pedidos</p>
          <p>Prueba con otros términos de búsqueda o cambiando el filtro seleccionado.</p>
          <Button size="sm" variant="outline" onClick={() => { setSearch(''); setTab('todos') }} className="mt-2 text-xs">
            Restablecer filtros
          </Button>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {filteredOrders.map((order) => {
          const latestNovedad = order.novedades[0]
          const isExpanded = expandedId === order.id
          const progress = getOrderProgressPercent(order.status)
          const showEta = order.status === 'enviado' || order.status === 'en_camino'

          return (
            <Card
              key={order.id}
              className={`group flex flex-col gap-4 border-l-4 p-5 transition-all hover:border-brand-red/40 hover:shadow-sm ${ORDER_STATUS_ACCENT[order.status]}`}
            >
              <Link
                to={`/portal/pedidos/${order.id}`}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-border-soft text-brand-dark">
                      <Package className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-brand-dark">{order.id}</p>
                        {order.projectName && (
                          <span className="rounded-full bg-brand-dark/5 px-2.5 py-0.5 text-[11px] font-semibold text-brand-dark">
                            {order.projectName}
                          </span>
                        )}
                        <Badge variant={ORDER_STATUS_BADGE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                        {order.status === 'entregado' && !order.rated && (
                          <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                            Por calificar
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-gray">
                        <span>{formatOrderDate(order.createdAt)}</span>
                        {order.destinationAddress && <span>· {order.destinationAddress}</span>}
                        {showEta && order.deliveryEta && (
                          <span className="inline-flex items-center gap-1 font-semibold text-brand-red">
                            <Clock3 className="h-3 w-3" />
                            ETA {order.deliveryEta}
                          </span>
                        )}
                      </div>
                      {latestNovedad && (
                        <p className="mt-1.5 line-clamp-1 text-[11px] text-brand-gray/80">
                          <span className="font-semibold text-brand-dark/70">Novedad: </span>
                          {latestNovedad.text}
                        </p>
                      )}
                      <div className="mt-2.5 h-1 w-full max-w-48 overflow-hidden rounded-full bg-brand-border-soft">
                        <div
                          className={`h-full rounded-full transition-[width] duration-500 ${
                            order.status === 'entregado' ? 'bg-emerald-500' : 'bg-brand-red'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs hidden sm:inline-flex group-hover:border-brand-red group-hover:text-brand-red">
                    Rastreo detallado
                  </Button>
                  <ChevronRight className="h-5 w-5 shrink-0 text-brand-gray transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red" />
                </div>
              </Link>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setExpandedId(isExpanded ? null : order.id)
                }}
                className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-brand-red hover:underline cursor-pointer"
              >
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                {isExpanded ? 'Ocultar productos' : `Ver productos (${order.items.length})`}
              </button>

              {isExpanded && <ItemsPreviewList items={order.items} />}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
