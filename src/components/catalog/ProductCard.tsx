import { Plus, Eye, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product.types'

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
  onAddToQuote: (product: Product) => void
  className?: string
}

export function ProductCard({
  product,
  onViewDetail,
  onAddToQuote,
  className,
}: ProductCardProps) {
  const primarySpec = product.specifications?.[0]?.value

  return (
    <article
      onClick={() => onViewDetail(product)}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white',
        'border border-[#E7E5E0] transition-all duration-200',
        'hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-black/5',
        className
      )}
    >
      {/* 1. Pure, unobstructed product photo container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F3F0]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover overlay hint */}
        <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-dark shadow-sm">
            <Eye className="h-3.5 w-3.5 text-brand-red" />
            Ver detalles
          </span>
        </div>
      </div>

      {/* 2. Content & technical metadata */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between text-xs text-brand-gray">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-brand-dark/70">
              {product.category}
            </span>
            {product.datasheetAvailable && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                <FileText className="h-3 w-3" />
                Ficha PDF
              </span>
            )}
          </div>

          <h4 className="mt-1.5 text-sm font-bold text-brand-dark transition-colors group-hover:text-brand-red line-clamp-2">
            {product.name}
          </h4>

          {primarySpec && (
            <p className="mt-1 text-xs text-brand-gray line-clamp-1">
              {primarySpec}
            </p>
          )}
        </div>

        {/* 3. Action row */}
        <div className="mt-4 pt-3 border-t border-[#F0EFEA] flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-brand-gray">
            Suministro certificado
          </span>

          <button
            type="button"
            title="Agregar a solicitud de cotización"
            onClick={(e) => {
              e.stopPropagation()
              onAddToQuote(product)
            }}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer',
              'bg-brand-dark text-white hover:bg-brand-red active:scale-95'
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Cotizar</span>
          </button>
        </div>
      </div>
    </article>
  )
}
