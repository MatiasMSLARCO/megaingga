import { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router'
import { ChevronLeft, Check, FileCheck2, Minus, PackageSearch, Plus } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useProductBySlug } from '@/hooks/useProducts'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { AppOutletContext } from '@/types/outlet-context.types'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { addToQuote } = useOutletContext<AppOutletContext>()
  const { data: product, isLoading } = useProductBySlug(slug)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useDocumentTitle(product?.name)

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 2000)
    return () => clearTimeout(timer)
  }, [added])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-lg bg-brand-border-soft" />
          <div className="flex flex-col gap-3">
            <div className="h-6 w-2/3 animate-pulse rounded bg-brand-border-soft" />
            <div className="h-24 animate-pulse rounded bg-brand-border-soft" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-8">
        <PackageSearch className="h-10 w-10 text-brand-gray/40" />
        <p className="text-lg font-bold text-brand-dark">Producto no encontrado</p>
        <p className="text-sm text-brand-gray">El producto que buscas no existe o ya no está disponible.</p>
        <Link to="/servicios" className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-red hover:underline">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const images = [product.imageUrl, ...(product.gallery ?? [])]

  const handleAdd = () => {
    addToQuote(product, quantity)
    setAdded(true)
    setQuantity(1)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        to="/servicios"
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gray hover:text-brand-red"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-10 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-brand-border-soft">
            <img src={images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.slice(1).map((src) => (
                <div key={src} className="h-20 w-20 overflow-hidden rounded-md bg-brand-border-soft">
                  <img src={src} alt={product.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="dark">{product.category}</Badge>
            {product.datasheetAvailable && (
              <Badge variant="outline" className="gap-1">
                <FileCheck2 className="h-3 w-3" />
                Ficha técnica disponible
              </Badge>
            )}
          </div>

          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-brand-dark sm:text-3xl">
            {product.name}
          </h1>

          <p className="text-sm leading-relaxed text-brand-gray">{product.fullDescription}</p>

          {product.specifications.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wide text-brand-dark">Especificaciones</h2>
              <dl className="flex flex-col gap-1 text-sm">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 border-b border-brand-border-soft py-1">
                    <dt className="text-brand-gray">{spec.label}</dt>
                    <dd className="text-right font-medium text-brand-dark">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {product.standards.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wide text-brand-dark">Normas y Materiales</h2>
              <div className="flex flex-wrap gap-2">
                {product.standards.map((standard) => (
                  <Badge key={standard} variant="outline">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center gap-4 border-t border-brand-border-soft pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-border text-brand-dark hover:border-brand-red hover:text-brand-red cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-brand-dark">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar cantidad"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-border text-brand-dark hover:border-brand-red hover:text-brand-red cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button className="flex-1" onClick={handleAdd}>
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Agregado
                </>
              ) : (
                'Agregar a Cotización'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
