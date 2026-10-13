import { useState } from 'react'
import { PackageSearch } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductFilters, type DivisionFilter } from '@/components/catalog/ProductFilters'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductDetailModal } from '@/components/catalog/ProductDetailModal'
import type { Product } from '@/types/product.types'

interface ServicesSectionProps {
  onAddToQuote: (product: Product, quantity?: number) => void
}

export function ServicesSection({ onAddToQuote }: ServicesSectionProps) {
  const [division, setDivision] = useState<DivisionFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data: products, isLoading } = useProducts({
    division: division === 'all' ? undefined : division,
    search,
  })

  const handleReset = () => {
    setDivision('all')
    setSearch('')
  }

  return (
    <section id="servicios" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-brand-dark sm:text-4xl">
            Catálogo Técnico
          </h2>
          <div className="mt-3 h-1 w-16 bg-brand-red" />
          <p className="mt-4 text-sm leading-relaxed text-brand-gray">
            Soluciones en acabados hospitalarios, climatización industrial y equipos especiales, con ficha técnica
            disponible para cada línea.
          </p>
        </div>

        <div className="mb-8">
          <ProductFilters active={division} onChange={setDivision} search={search} onSearchChange={setSearch} />
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-80 animate-pulse rounded-lg bg-brand-border-soft" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={setSelectedProduct}
                onAddToQuote={(p) => onAddToQuote(p)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-brand-border py-16 text-center">
            <PackageSearch className="h-10 w-10 text-brand-gray/40" />
            <p className="text-sm font-semibold text-brand-dark">No se encontraron productos</p>
            <p className="max-w-xs text-sm text-brand-gray">
              Intenta con otro término de búsqueda o restablece los filtros de categoría.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-red hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={(product, quantity) => onAddToQuote(product, quantity)}
      />
    </section>
  )
}
