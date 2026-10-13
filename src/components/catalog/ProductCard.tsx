import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types/product.types'

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
  onAddToQuote: (product: Product) => void
}

export function ProductCard({ product, onViewDetail, onAddToQuote }: ProductCardProps) {
  return (
    <Card className="flex cursor-pointer flex-col overflow-hidden" onClick={() => onViewDetail(product)}>
      <div className="aspect-[4/3] w-full overflow-hidden bg-brand-border-soft">
        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="outline" className="w-fit">
          {product.category}
        </Badge>
        <h3 className="text-sm font-bold text-brand-dark">{product.name}</h3>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-brand-gray">{product.shortDescription}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onAddToQuote(product)
          }}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md border border-brand-red px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand-red transition-colors hover:bg-brand-red hover:text-white cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar a Cotización
        </button>
      </div>
    </Card>
  )
}
