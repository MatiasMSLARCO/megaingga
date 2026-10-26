import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductFilterSidebar } from '@/components/catalog/ProductFilterSidebar'
import type { DivisionFilter } from '@/components/catalog/ProductFilters'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductDetailModal } from '@/components/catalog/ProductDetailModal'
import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/types/product.types'

type SortMode = 'relevancia' | 'mas_vendidos' | 'nombre'

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'mas_vendidos', label: 'Más vendidos' },
  { value: 'nombre', label: 'Nombre A-Z' },
]

interface CatalogGridProps {
  onAddToQuote: (product: Product, quantity?: number) => void
}

export function CatalogGrid({ onAddToQuote }: CatalogGridProps) {
  const [division, setDivision] = useState<DivisionFilter>('all')
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('relevancia')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [datasheetOnly, setDatasheetOnly] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data: allProducts = [], isLoading } = useProducts()

  const divisionCounts = useMemo(() => {
    const counts: Record<DivisionFilter, number> = {
      all: allProducts.length,
      hospitalario: 0,
      climatizacion: 0,
      especiales: 0,
    }
    for (const product of allProducts) counts[product.division]++
    return counts
  }, [allProducts])

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase()

    let results = allProducts.filter((product) => {
      if (division !== 'all' && product.division !== division) return false
      if (featuredOnly && !product.featured) return false
      if (datasheetOnly && !product.datasheetAvailable) return false
      if (
        term.length > 1 &&
        !product.name.toLowerCase().includes(term) &&
        !product.shortDescription.toLowerCase().includes(term)
      ) {
        return false
      }
      return true
    })

    if (sortMode === 'mas_vendidos') {
      results = [...results].sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
    } else if (sortMode === 'nombre') {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name))
    }

    return results
  }, [allProducts, division, featuredOnly, datasheetOnly, search, sortMode])

  const hasActiveFilters = division !== 'all' || featuredOnly || datasheetOnly || search.trim().length > 0

  const handleReset = () => {
    setDivision('all')
    setFeaturedOnly(false)
    setDatasheetOnly(false)
    setSearch('')
  }

  const handleAdd = (product: Product, quantity = 1) => onAddToQuote(product, quantity)

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
      {/* Filtros: sidebar fija en desktop, panel colapsable en mobile/tablet */}
      <div className="xl:w-56 xl:shrink-0">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((o) => !o)}
          className="mb-3 flex w-full items-center justify-between rounded-xl border border-brand-border/60 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-dark cursor-pointer xl:hidden"
        >
          <span className="inline-flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
          </span>
          {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-brand-red" />}
        </button>

        <div className={cn('xl:block', mobileFiltersOpen ? 'block' : 'hidden')}>
          <ProductFilterSidebar
            active={division}
            onChange={setDivision}
            divisionCounts={divisionCounts}
            featuredOnly={featuredOnly}
            onFeaturedOnlyChange={setFeaturedOnly}
            datasheetOnly={datasheetOnly}
            onDatasheetOnlyChange={setDatasheetOnly}
            hasActiveFilters={hasActiveFilters}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Resultados */}
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-brand-border/60 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto o norma..."
              className="h-10 w-full rounded-xl border border-brand-border/80 bg-brand-border-soft/20 pl-10 pr-9 text-xs font-medium text-brand-dark placeholder:text-brand-gray/60 outline-none transition-all focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-dark cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="whitespace-nowrap text-xs font-semibold text-brand-gray">
              {visibleProducts.length} {visibleProducts.length === 1 ? 'producto' : 'productos'}
            </span>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-gray">
              Ordenar:
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="cursor-pointer rounded-lg border border-brand-border/80 bg-white px-2.5 py-1.5 text-xs font-bold text-brand-dark outline-none focus:border-brand-red"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 2xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-brand-border-soft/60" />
            ))}
          </div>
        )}

        {!isLoading && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 2xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={setSelectedProduct}
                onAddToQuote={handleAdd}
              />
            ))}
          </div>
        )}

        {!isLoading && visibleProducts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <p className="text-sm text-brand-gray">No se encontraron productos con estos filtros.</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-brand-red hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={(product, qty) => {
          handleAdd(product, qty)
          setSelectedProduct(null)
        }}
      />
    </div>
  )
}
