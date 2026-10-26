import { Card } from '@/components/ui/Card'
import type { QuoteItem } from '@/types/quote.types'

interface OrderItemsSummaryProps {
  items: QuoteItem[]
}

export function OrderItemsSummary({ items }: OrderItemsSummaryProps) {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wide text-brand-gray">Detalle del Pedido</h2>
        <span className="text-xs font-semibold text-brand-gray">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} · {totalUnits} unid.
        </span>
      </div>
      <div className="flex flex-col divide-y divide-brand-border-soft">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3 py-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-brand-border-soft">
              <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-dark">{item.product.name}</p>
              <p className="text-xs text-brand-gray">{item.product.category}</p>
            </div>
            <p className="shrink-0 text-sm font-bold text-brand-dark">x{item.quantity}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
