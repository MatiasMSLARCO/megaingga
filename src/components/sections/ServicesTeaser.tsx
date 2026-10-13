import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductDetailModal } from '@/components/catalog/ProductDetailModal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useState } from 'react'
import type { Product } from '@/types/product.types'

// Mismos 4 IDs curados que usa la tienda completa, para que el teaser y la
// tienda cuenten la misma historia de producto.
const FEATURED_IDS = ['prod-04', 'prod-02', 'prod-09', 'prod-12']

interface ServicesTeaserProps {
  onAddToQuote: (product: Product, quantity?: number) => void
  onBuyNow: (product: Product, quantity: number) => void
}

export function ServicesTeaser({ onAddToQuote, onBuyNow }: ServicesTeaserProps) {
  const { data: allProducts, isLoading } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.08, deps: [allProducts, isLoading] })

  const featured = allProducts?.filter((p) => FEATURED_IDS.includes(p.id)) ?? []

  return (
    <section ref={ref} id="servicios" className="border-t border-[#EAE8E3] bg-white py-24 text-brand-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-12">
          <SectionHeading
            title={
              <>
                Equipamiento <span className="italic text-brand-red">destacado</span>.
              </>
            }
            subtitle="Una muestra de nuestro catálogo técnico certificado. Fichas completas, normas y cotización directa en la tienda."
            actions={
              <Link
                to="/tienda"
                className="group inline-flex w-fit items-center gap-2 border-b-2 border-brand-dark pb-1 font-mono text-xs font-semibold uppercase tracking-wider text-brand-dark transition-colors hover:border-brand-red hover:text-brand-red"
              >
                Ver Tienda Completa
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-80 animate-pulse rounded-lg bg-brand-border-soft/60" />
            ))}
          </div>
        ) : (
          <div data-reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={setSelectedProduct}
                onAddToQuote={(p) => onAddToQuote(p)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={(product, quantity) => onAddToQuote(product, quantity)}
        onBuyNow={(product, quantity) => {
          setSelectedProduct(null)
          onBuyNow(product, quantity)
        }}
      />
    </section>
  )
}
