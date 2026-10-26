import type { QuoteItem } from '@/types/quote.types'

interface ItemsPreviewListProps {
  items: QuoteItem[]
}

export function ItemsPreviewList({ items }: ItemsPreviewListProps) {
  return (
    <div className="flex flex-col divide-y divide-brand-border-soft rounded-md border border-brand-border-soft bg-brand-border-soft/20">
      {items.map((item) => (
        <div key={item.productId} className="flex items-center gap-2.5 p-2.5">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-brand-border-soft">
            <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-xs font-semibold text-brand-dark">{item.product.name}</p>
            <p className="text-[11px] text-brand-gray">{item.product.category}</p>
          </div>
          <p className="shrink-0 text-xs font-bold text-brand-dark">x{item.quantity}</p>
        </div>
      ))}
    </div>
  )
}
