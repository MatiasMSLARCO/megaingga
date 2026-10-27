import { Sparkles, Package, FileText, Star, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useOrders } from '@/hooks/useOrders'
import { useQuotes } from '@/hooks/useQuotes'
import { useToast } from '@/context/ToastContext'
import { ORDER_STATUS_LABELS } from '@/lib/orderStatus'
import { buildAiSummary, getTopProducts } from '@/lib/aiReports'
import type { OrderStatus } from '@/types/order.types'

const STATUS_ORDER: OrderStatus[] = ['cotizando', 'aceptado', 'preparacion', 'enviado', 'en_camino', 'entregado']

export function ReportsPage() {
  const { data: orders = [], isLoading: ordersLoading } = useOrders()
  const { data: quotes = [], isLoading: quotesLoading } = useQuotes()
  const { toast } = useToast()

  const isLoading = ordersLoading || quotesLoading

  const deliveredOrders = orders.filter((o) => o.status === 'entregado')
  const activeQuotesCount = quotes.filter((q) => q.status === 'activa').length
  const pendingQuotesCount = quotes.filter((q) => q.status !== 'completada').length
  const topProducts = getTopProducts(orders, 5)
  const topProduct = topProducts[0]?.name ?? null
  const aiSummary = buildAiSummary(deliveredOrders.length, pendingQuotesCount, topProduct)

  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }))
  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count))
  const maxProductQuantity = Math.max(1, ...topProducts.map((p) => p.quantity))

  const handleGenerateReport = () => {
    toast({
      title: 'Generando reporte con IA',
      description: 'Estamos analizando tu historial de pedidos y cotizaciones. Te avisaremos cuando esté listo.',
      variant: 'info',
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-semibold text-brand-dark">Reportes con IA</h1>
            <Badge variant="outline" className="text-[10px]">
              Beta
            </Badge>
          </div>
          <p className="mt-1 text-sm text-brand-gray">Análisis automático de tu actividad de pedidos y cotizaciones.</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={handleGenerateReport}>
          <Sparkles className="h-3.5 w-3.5" />
          Generar reporte
        </Button>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center gap-2 text-sm text-brand-gray">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analizando tu actividad...
        </div>
      )}

      {!isLoading && (
        <>
          {/* Resumen IA */}
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
          </Card>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <Package className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xl font-bold text-brand-dark">{deliveredOrders.length}</p>
                <p className="text-[11px] text-brand-gray">Pedidos entregados</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xl font-bold text-brand-dark">{activeQuotesCount}</p>
                <p className="text-[11px] text-brand-gray">Cotizaciones activas</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                <Star className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xl font-bold text-brand-dark">94%</p>
                <p className="text-[11px] text-brand-gray">Entregas a tiempo (IA)</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark/10 text-brand-dark">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-bold text-brand-dark" title={topProduct ?? undefined}>
                  {topProduct ?? '—'}
                </p>
                <p className="text-[11px] text-brand-gray">Producto más pedido</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Distribución por estado */}
            <Card className="p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-brand-gray">
                Pedidos por estado
              </h2>
              <div className="flex flex-col gap-3">
                {statusCounts.map(({ status, count }) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs font-semibold text-brand-dark">
                      {ORDER_STATUS_LABELS[status]}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-border-soft">
                      <div
                        className="h-full rounded-full bg-brand-red transition-[width] duration-500"
                        style={{ width: `${(count / maxStatusCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-5 shrink-0 text-right text-xs font-bold text-brand-gray">{count}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top productos */}
            <Card className="p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-brand-gray">
                Productos más solicitados
              </h2>
              {topProducts.length === 0 ? (
                <p className="text-xs text-brand-gray">Aún no hay suficientes pedidos para este análisis.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center gap-3">
                      <span className="w-5 shrink-0 text-xs font-bold text-brand-gray">{index + 1}.</span>
                      <span className="w-32 shrink-0 truncate text-xs font-semibold text-brand-dark" title={product.name}>
                        {product.name}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-border-soft">
                        <div
                          className="h-full rounded-full bg-brand-dark transition-[width] duration-500"
                          style={{ width: `${(product.quantity / maxProductQuantity) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs font-bold text-brand-gray">
                        {product.quantity}u
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Insights IA */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-red" />
              <h2 className="text-xs font-bold uppercase tracking-wide text-brand-gray">Insights generados por IA</h2>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs text-brand-gray">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <span>
                  Tus pedidos a Ambato concentran la mayor parte del volumen logístico este periodo, principalmente
                  por envíos al sector hospitalario.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <span>El tiempo promedio entre cotización y aceptación se mantiene estable frente al periodo anterior.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <span>
                  Considera repetir tu cotización más reciente si necesitas reabastecer productos de alta rotación.
                </span>
              </li>
            </ul>
          </Card>
        </>
      )}
    </div>
  )
}
