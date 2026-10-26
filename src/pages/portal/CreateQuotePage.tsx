import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ShoppingCart, Minus, Plus, X, Sparkles, Building2, Calendar, FileText, Upload, Paperclip } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { CatalogGrid } from '@/components/portal/CatalogGrid'
import { useQuoteCart } from '@/hooks/useQuoteCart'
import { useCreateQuote } from '@/hooks/useQuotes'
import { useToast } from '@/context/ToastContext'
import { productsMock } from '@/data/products.mock'

export function CreateQuotePage() {
  const navigate = useNavigate()
  const cart = useQuoteCart()
  const createQuote = useCreateQuote()
  const { toast } = useToast()

  const [projectName, setProjectName] = useState('')
  const [requiredDate, setRequiredDate] = useState('')
  const [notes, setNotes] = useState('')
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  const handleFinish = () => {
    if (cart.items.length === 0) return
    createQuote.mutate(
      {
        items: cart.items,
        details: {
          projectName: projectName || undefined,
          requiredDate: requiredDate || undefined,
          notes: notes || undefined,
        },
      },
      {
        onSuccess: (quote) => {
          cart.clear()
          toast({
            title: 'Cotización generada exitosamente',
            description: `${quote.id} registrada para ${projectName || 'tu empresa'}. Nuestro equipo la revisará de inmediato.`,
            variant: 'success',
          })
          navigate('/portal/cotizaciones')
        },
        onError: () => {
          toast({
            title: 'No se pudo generar la cotización',
            description: 'Revisa tu conexión e intenta nuevamente.',
            variant: 'error',
          })
        },
      }
    )
  }

  const handleQuickSeed = () => {
    // Agrega 3 productos representativos para una demo inmediata
    const p1 = productsMock.find((p) => p.id === 'prod-01')
    const p2 = productsMock.find((p) => p.id === 'prod-02')
    const p3 = productsMock.find((p) => p.id === 'prod-04')
    if (p1) cart.addItem(p1, 5)
    if (p2) cart.addItem(p2, 2)
    if (p3) cart.addItem(p3, 1)
    setProjectName('Edificio Horizon - Av. Amazonas')
    setRequiredDate('2026-11-15')
    setNotes('Entregar en subsuelo 2 con grúa de descarga. Contactar al residente de obra.')
    toast({
      title: 'Materiales de ejemplo cargados',
      description: 'Se agregaron 3 productos y datos de obra para tu demo rápida.',
      variant: 'info',
    })
  }

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name)
      toast({
        title: 'Planilla técnica adjunta',
        description: `Se adjuntó: ${e.target.files[0].name}`,
        variant: 'success',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="min-w-0 flex-1">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-dark">Crear Cotización</h1>
            <p className="mt-1 text-sm text-brand-gray">Explora el catálogo y agrega los suministros de ingeniería que necesitas.</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleQuickSeed}
            className="gap-1.5 border-dashed border-brand-red text-brand-red hover:bg-brand-red/5 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            ⚡ Cargar materiales de ejemplo para demo
          </Button>
        </div>
        <CatalogGrid onAddToQuote={(product, qty) => cart.addItem(product, qty)} />
      </div>

      <Card className="flex w-full flex-col p-5 xl:sticky xl:top-6 xl:w-80 xl:shrink-0 gap-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-brand-border-soft pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4.5 w-4.5 text-brand-red" />
            <h2 className="text-xs font-bold uppercase tracking-wide text-brand-dark">
              Tu Cotización ({cart.totalItemsCount})
            </h2>
          </div>
          {cart.items.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="text-[11px] text-brand-gray hover:text-brand-red cursor-pointer"
            >
              Vaciar
            </button>
          )}
        </div>

        {cart.items.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-xs text-brand-gray">Aún no agregas productos al pedido.</p>
            <p className="mt-1 text-[11px] text-brand-gray/70">Selecciona cantidades del catálogo a la izquierda.</p>
          </div>
        )}

        {/* Lista de items en el carrito */}
        <div className="flex max-h-56 flex-col gap-3 overflow-y-auto pr-1">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-2 border-b border-brand-border-soft pb-2.5">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-brand-border-soft">
                <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="line-clamp-1 text-xs font-semibold text-brand-dark">{item.product.name}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-5 w-5 items-center justify-center rounded bg-brand-border-soft text-brand-dark hover:bg-brand-border cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold text-brand-dark">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                    className="flex h-5 w-5 items-center justify-center rounded bg-brand-border-soft text-brand-dark hover:bg-brand-border cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => cart.removeItem(item.productId)}
                aria-label="Quitar"
                className="shrink-0 text-brand-gray hover:text-brand-red cursor-pointer p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Datos B2B Contextuales de la Obra */}
        {cart.items.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-brand-border-soft pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-gray">Datos del Proyecto / Obra</p>
            
            <div>
              <label className="text-[11px] font-semibold text-brand-dark flex items-center gap-1 mb-1">
                <Building2 className="h-3 w-3 text-brand-red" />
                Nombre del Proyecto / Obra
              </label>
              <input
                type="text"
                placeholder="Ej. Torre Bellavista - Quito"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="h-8 w-full rounded border border-brand-border bg-white px-2.5 text-xs text-brand-dark outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-dark flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3 text-brand-red" />
                Fecha requerida en obra
              </label>
              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="h-8 w-full rounded border border-brand-border bg-white px-2.5 text-xs text-brand-dark outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-dark flex items-center gap-1 mb-1">
                <FileText className="h-3 w-3 text-brand-red" />
                Instrucciones técnicas / descarga
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Requiere grúa o descarga en subsuelo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded border border-brand-border bg-white p-2 text-xs text-brand-dark outline-none focus:border-brand-red"
              />
            </div>

            {/* Simulador de adjuntar planilla BoQ / plano */}
            <div className="rounded-md border border-dashed border-brand-border p-2.5 text-center">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.doc,.docx"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
                {attachedFileName ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <Paperclip className="h-3.5 w-3.5" />
                    {attachedFileName}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-gray hover:text-brand-dark">
                    <Upload className="h-3.5 w-3.5" />
                    Adjuntar plano o planilla (PDF/Excel)
                  </span>
                )}
              </label>
            </div>
          </div>
        )}

        <Button
          className="mt-2 w-full gap-2 font-bold cursor-pointer"
          onClick={() => setShowSubmitModal(true)}
          disabled={cart.items.length === 0 || createQuote.isPending}
        >
          {createQuote.isPending ? 'Enviando solicitud...' : 'Finalizar y Enviar Cotización'}
        </Button>
      </Card>

      {/* Modal de confirmación para vaciar la cotización */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={() => {
          cart.clear()
          setShowClearModal(false)
          toast({
            title: 'Cotización vaciada',
            description: 'Se eliminaron todos los productos de tu solicitud actual.',
            variant: 'info',
          })
        }}
        title="¿Vaciar cotización?"
        description="Se eliminarán todos los productos y cantidades seleccionadas de tu carrito de cotización actual."
        confirmText="Sí, vaciar"
        cancelText="Conservar productos"
        variant="danger"
      />

      {/* Modal de confirmación para finalizar y enviar la cotización */}
      <ConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => {
          setShowSubmitModal(false)
          handleFinish()
        }}
        title="¿Enviar solicitud de cotización?"
        description={`Estás a punto de solicitar una cotización formal para ${cart.totalItemsCount} ${cart.totalItemsCount === 1 ? 'ítem' : 'ítems'}${projectName ? ` destinados a "${projectName}"` : ''}. Nuestro equipo técnico preparará la oferta de inmediato.`}
        confirmText="Sí, enviar cotización"
        cancelText="Revisar más"
        variant="brand"
        isPending={createQuote.isPending}
      />
    </div>
  )
}
