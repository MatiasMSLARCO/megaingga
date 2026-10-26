import { useState } from 'react'
import { ArrowRight, ChevronDown, Loader2, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ItemsPreviewList } from '@/components/portal/ItemsPreviewList'
import { useAdvanceOrderStatus, useOrders } from '@/hooks/useOrders'
import { useToast } from '@/context/ToastContext'
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABELS, formatOrderDate, getNextOrderStatus } from '@/lib/orderStatus'

export function BackofficeOrdersPage() {
  const { data: orders = [], isLoading } = useOrders()
  const advance = useAdvanceOrderStatus()
  const { toast } = useToast()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [advancingId, setAdvancingId] = useState<string | null>(null)

  const handleAdvance = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    const next = order ? getNextOrderStatus(order.status) : null
    if (!next) return

    setAdvancingId(orderId)
    advance.mutate(
      { orderId, status: next },
      {
        onSuccess: () => {
          toast({
            title: 'Pedido actualizado',
            description: `${orderId} ahora está "${ORDER_STATUS_LABELS[next]}".`,
            variant: 'success',
          })
        },
        onError: () => {
          toast({ title: 'No se pudo actualizar el pedido', variant: 'error' })
        },
        onSettled: () => setAdvancingId(null),
      }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark">Pedidos</h1>
        <p className="mt-1 text-sm text-brand-gray">Gestiona el estado de los pedidos de todos los clientes.</p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-brand-border-soft/60" />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id
          const next = getNextOrderStatus(order.status)
          const isAdvancing = advancingId === order.id

          return (
            <Card key={order.id} className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-border-soft text-brand-dark">
                    <Package className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-brand-dark">{order.id}</p>
                      <Badge variant={ORDER_STATUS_BADGE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-brand-gray">
                      {formatOrderDate(order.createdAt)}
                      {order.destinationAddress && ` · ${order.destinationAddress}`}
                    </p>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline cursor-pointer"
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      {isExpanded ? 'Ocultar productos' : `Ver productos (${order.items.length})`}
                    </button>
                  </div>
                </div>

                {next ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 gap-1.5"
                    onClick={() => handleAdvance(order.id)}
                    disabled={isAdvancing}
                  >
                    {isAdvancing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                    {isAdvancing ? 'Actualizando...' : `Avanzar a ${ORDER_STATUS_LABELS[next]}`}
                  </Button>
                ) : (
                  <Badge variant="default" className="shrink-0">
                    Completado
                  </Badge>
                )}
              </div>

              {isExpanded && <ItemsPreviewList items={order.items} />}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
