import { createPortal } from 'react-dom'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QuoteItem } from '@/types/quote.types'
import { Button } from '@/components/ui/Button'

interface QuoteDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: QuoteItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onCheckout: () => void
}

export function QuoteDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }: QuoteDrawerProps) {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)

  return createPortal(
    <div className={cn('fixed inset-0 z-[110]', !isOpen && 'pointer-events-none')}>
      <div
        className={cn(
          'absolute inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-brand-border-soft px-6 py-4">
          <h2 className="text-lg font-bold uppercase tracking-wide text-brand-dark">Cotización</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar cotizador"
            className="rounded-full p-1.5 text-brand-gray transition-colors hover:bg-black/5 hover:text-brand-red cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag className="h-10 w-10 text-brand-gray/40" />
              <p className="text-sm font-semibold text-brand-dark">Tu cotización está vacía</p>
              <p className="max-w-xs text-sm text-brand-gray">
                Explora el catálogo técnico y agrega productos para generar tu solicitud de cotización.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 border-b border-brand-border-soft pb-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-brand-dark">{item.product.name}</span>
                      <button
                        type="button"
                        onClick={() => onRemove(item.productId)}
                        aria-label="Quitar producto"
                        className="shrink-0 text-brand-gray transition-colors hover:text-brand-red cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-brand-gray">{item.product.category}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Disminuir cantidad"
                        className="flex h-7 w-7 items-center justify-center rounded border border-brand-border text-brand-dark hover:border-brand-red hover:text-brand-red cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-brand-dark">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                        className="flex h-7 w-7 items-center justify-center rounded border border-brand-border text-brand-dark hover:border-brand-red hover:text-brand-red cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-brand-border-soft px-6 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-brand-gray">Total de ítems</span>
            <span className="font-bold text-brand-dark">{totalUnits}</span>
          </div>
          <Button className="w-full" disabled={items.length === 0} onClick={onCheckout}>
            Solicitar Cotización
          </Button>
        </div>
      </aside>
    </div>,
    document.body
  )
}
