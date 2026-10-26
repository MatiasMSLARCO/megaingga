import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Lock, LogIn } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useAuth } from '@/context/AuthContext'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductDetailModal } from '@/components/catalog/ProductDetailModal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types/product.types'

const FEATURED_IDS = ['prod-04', 'prod-02', 'prod-09', 'prod-12']

interface ServicesTeaserProps {
  onAddToQuote?: (product: Product, quantity?: number) => void
  onBuyNow?: (product: Product, quantity: number) => void
}

export function ServicesTeaser({ onAddToQuote }: ServicesTeaserProps) {
  const { data: allProducts, isLoading } = useProducts()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [productToQuote, setProductToQuote] = useState<Product | null>(null)
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.08, deps: [allProducts, isLoading] })

  const featured = allProducts?.filter((p) => FEATURED_IDS.includes(p.id)) ?? []

  const handleRequestQuote = (product: Product, quantity = 1) => {
    if (session) {
      if (onAddToQuote) onAddToQuote(product, quantity)
      navigate('/portal/cotizaciones/crear')
      return
    }
    setProductToQuote(product)
    setShowAuthModal(true)
  }

  const handleGoToLogin = () => {
    setShowAuthModal(false)
    navigate('/ingresar?redirect=/portal/cotizaciones/crear')
  }

  return (
    <section ref={ref} id="suministros" className="border-t border-[#EAE8E3] bg-white py-24 text-brand-dark scroll-mt-16">
      <span id="servicios" className="sr-only" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-12">
          <SectionHeading
            title={
              <>
                Insumos y equipamiento <span className="italic text-brand-red">destacado</span>.
              </>
            }
            subtitle="Muestra representativa de suministros certificados. El catálogo completo y la generación de cotizaciones se gestionan de forma privada en el Portal de Clientes."
            actions={
              <Link
                to={session ? '/portal/cotizaciones/crear' : '/ingresar?redirect=/portal/cotizaciones/crear'}
                className="group inline-flex w-fit items-center gap-2 border-b-2 border-brand-dark pb-1 font-mono text-xs font-semibold uppercase tracking-wider text-brand-dark transition-colors hover:border-brand-red hover:text-brand-red"
              >
                Catálogo en Portal B2B
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
                onAddToQuote={(p) => handleRequestQuote(p, 1)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle de producto con acción de cotización en portal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={(product, quantity) => {
          setSelectedProduct(null)
          handleRequestQuote(product, quantity)
        }}
      />

      {/* Modal de solicitud de inicio de sesión para cotizaciones B2B */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} className="max-w-md">
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-dark">
                Acceso al Portal de Clientes
              </h3>
              <p className="mt-1 text-xs text-brand-gray leading-relaxed">
                {productToQuote
                  ? `Para cotizar "${productToQuote.name}" y revisar fichas técnicas con despacho a obra, ingresa a tu cuenta corporativa.`
                  : 'Para acceder al catálogo técnico completo y generar solicitudes de cotización, debes iniciar sesión con tus credenciales de cliente.'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-brand-border-soft pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAuthModal(false)}
              className="text-xs"
            >
              Continuar explorando
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleGoToLogin}
              className="text-xs gap-1.5 font-bold bg-brand-red hover:bg-brand-red/90 text-white"
            >
              <LogIn className="h-3.5 w-3.5" />
              Iniciar sesión en el Portal
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
