import { useState } from 'react'
import { FileCheck2, Minus, Plus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types/product.types'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
  onAddToQuote: (product: Product, quantity: number) => void
}

export function ProductDetailModal({ product, onClose, onAddToQuote }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleAdd = () => {
    onAddToQuote(product, quantity)
    setQuantity(1)
    onClose()
  }

  const images = [product.imageUrl, ...(product.gallery ?? [])]

  return (
    <Modal isOpen={Boolean(product)} onClose={onClose} title={product.name} className="max-w-3xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="aspect-[4/3] overflow-hidden rounded-md bg-brand-border-soft">
            <img src={images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.slice(1).map((src) => (
                <div key={src} className="h-16 w-16 overflow-hidden rounded-md bg-brand-border-soft">
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

          <p className="text-sm leading-relaxed text-brand-gray">{product.fullDescription}</p>

          {product.specifications.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-brand-dark">Especificaciones</h4>
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
              <h4 className="text-xs font-bold uppercase tracking-wide text-brand-dark">Normas y Materiales</h4>
              <div className="flex flex-wrap gap-2">
                {product.standards.map((standard) => (
                  <Badge key={standard} variant="outline">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2.5 border-t border-brand-border-soft pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-brand-border bg-zinc-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Disminuir cantidad"
                  className="flex h-8 w-8 items-center justify-center rounded text-brand-dark hover:bg-white hover:text-brand-red cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-brand-dark">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumentar cantidad"
                  className="flex h-8 w-8 items-center justify-center rounded text-brand-dark hover:bg-white hover:text-brand-red cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button className="flex-1 gap-2 font-bold py-2.5 bg-brand-dark hover:bg-brand-red text-white cursor-pointer" onClick={handleAdd}>
                <FileCheck2 className="h-4 w-4" />
                <span>Solicitar Cotización en Portal</span>
              </Button>
            </div>

            <p className="text-[11px] text-brand-gray text-center pt-1">
              Suministro B2B con entrega técnica en obra para clientes registrados de Megaingga.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
