import { type FormEvent, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import {
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { companyInfo } from '@/data/company.data'
import { calculateOrderTotal, estimateUnitPrice } from '@/services/payment.service'
import { submitQuoteRequest } from '@/services/quote.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { QuoteCustomerData, QuoteItem, QuoteRequest } from '@/types/quote.types'

interface QuoteDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: QuoteItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
  initialTab?: 'quote' | 'pay'
}

const INITIAL_CUSTOMER: QuoteCustomerData = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  cityOrProjectLocation: '',
  projectScopeNotes: '',
}

function buildWhatsappMessage(request: QuoteRequest): string {
  const lines = [
    `*SOLICITUD DE COTIZACIÓN TÉCNICA — MEGA INGENIERÍA*`,
    `Folio: *${request.id}*`,
    `Fecha: ${new Date().toLocaleDateString('es-EC')}`,
    '--------------------------------------',
    `*Datos del Solicitante:*`,
    `• Nombre: ${request.customer.fullName}`,
    request.customer.companyName ? `• Empresa / RUC: ${request.customer.companyName}` : '',
    request.customer.phone ? `• Teléfono: ${request.customer.phone}` : '',
    request.customer.email ? `• Correo: ${request.customer.email}` : '',
    request.customer.cityOrProjectLocation ? `• Ubicación / Ciudad: ${request.customer.cityOrProjectLocation}` : '',
    '--------------------------------------',
    '*Equipamiento solicitado:*',
    ...request.items.map(
      (item) => `• ${item.product.name} (Cant: ${item.quantity} un.) [${item.product.category}]`
    ),
  ]

  if (request.customer.projectScopeNotes) {
    lines.push('--------------------------------------', `*Notas del proyecto / Requerimientos:*`, request.customer.projectScopeNotes)
  }

  lines.push('', 'Favor remitir proforma formal con fichas técnicas y tiempos de entrega.')

  return lines.filter(Boolean).join('\n')
}

export function QuoteDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  initialTab = 'quote',
}: QuoteDrawerProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'quote' | 'pay'>(initialTab)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  // Sincronizar tab cuando se abre el drawer
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true)
    setActiveTab(initialTab)
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false)
  }

  // Formulario Cotización B2B
  const [customer, setCustomer] = useState<QuoteCustomerData>(INITIAL_CUSTOMER)
  const [quoteStatus, setQuoteStatus] = useState<'form' | 'submitting' | 'success'>('form')
  const [quoteResult, setQuoteResult] = useState<QuoteRequest | null>(null)

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotalAmount = calculateOrderTotal(items)
  const ivaAmount = subtotalAmount * 0.15
  const totalAmount = subtotalAmount + ivaAmount

  const isQuoteFormValid =
    customer.fullName.trim().length > 0 &&
    (customer.phone.trim().length >= 7 || customer.email.trim().length >= 5)

  const handleQuoteSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isQuoteFormValid || items.length === 0) return

    setQuoteStatus('submitting')
    try {
      const request = await submitQuoteRequest(customer, items)
      setQuoteResult(request)
      setQuoteStatus('success')
    } catch {
      setQuoteStatus('form')
    }
  }

  const handleOpenWhatsapp = () => {
    if (!quoteResult) return
    const text = buildWhatsappMessage(quoteResult)
    window.open(`https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleResetQuote = () => {
    setQuoteStatus('form')
    setQuoteResult(null)
    setCustomer(INITIAL_CUSTOMER)
    onClear()
    onClose()
  }

  const handleProceedToCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return createPortal(
    <div className={cn('fixed inset-0 z-[110]', !isOpen && 'pointer-events-none')}>
      {/* Fondo oscuro translúcido */}
      <div
        className={cn(
          'absolute inset-0 bg-brand-dark/65 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      {/* Drawer lateral */}
      <aside
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Cabecera del Drawer */}
        <div className="flex items-center justify-between border-b border-brand-border-soft px-6 py-4.5 bg-brand-dark text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red text-white shadow-xs">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Mesa de Pedido Técnico</h2>
              <p className="text-xs text-white/70">
                {items.length === 0 ? 'Sin equipos seleccionados' : `${totalUnits} equipos en lista`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4efe2] text-brand-dark">
              <ShoppingBag className="h-8 w-8 text-brand-gray" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-lg font-bold text-brand-dark">Tu lista está vacía</h3>
              <p className="mt-1.5 text-sm text-brand-gray leading-relaxed">
                Navega por nuestro catálogo de infraestructura hospitalaria y climatización industrial para solicitar proformas técnicas o simular pagos.
              </p>
            </div>
            <Button
              onClick={() => {
                onClose()
                navigate('/tienda')
              }}
              className="mt-2 gap-2 font-bold cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Explorar Catálogo Técnico</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Selector de Modalidad (Segmented Control) */}
            <div className="border-b border-brand-border-soft bg-zinc-50/80 p-3">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-zinc-200/80 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('quote')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer',
                    activeTab === 'quote'
                      ? 'bg-white text-brand-dark shadow-xs'
                      : 'text-zinc-600 hover:text-brand-dark'
                  )}
                >
                  <Building2 className="h-4 w-4 text-brand-red" />
                  <span>1. Cotización Formal (B2B)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pay')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer',
                    activeTab === 'pay'
                      ? 'bg-white text-brand-dark shadow-xs'
                      : 'text-zinc-600 hover:text-brand-dark'
                  )}
                >
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>2. Pago en Línea (Demo)</span>
                </button>
              </div>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Sección 1: Equipos Seleccionados (El Carrito) */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                    Equipos en el Carrito ({items.length})
                  </span>
                  <button
                    type="button"
                    onClick={onClear}
                    className="text-xs font-medium text-brand-gray hover:text-brand-red transition-colors cursor-pointer"
                  >
                    Vaciar lista
                  </button>
                </div>

                <ul className="divide-y divide-brand-border-soft rounded-lg border border-brand-border-soft bg-white">
                  {items.map((item) => {
                    const unitPrice = estimateUnitPrice(item.product.division)
                    return (
                      <li key={item.productId} className="flex gap-3.5 p-3.5">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-16 w-16 shrink-0 rounded-md object-cover border border-zinc-100"
                        />
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-bold text-brand-dark leading-snug line-clamp-1">
                                {item.product.name}
                              </h4>
                              <p className="text-[11px] text-brand-gray">{item.product.category}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemove(item.productId)}
                              aria-label="Quitar equipo"
                              className="text-zinc-400 hover:text-brand-red transition-colors cursor-pointer p-0.5"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            {/* Stepper de cantidad */}
                            <div className="flex items-center gap-1.5 rounded border border-brand-border bg-zinc-50 p-0.5">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                                aria-label="Disminuir"
                                className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:bg-white hover:text-brand-dark cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-brand-dark">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                                aria-label="Aumentar"
                                className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:bg-white hover:text-brand-dark cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="text-xs font-mono font-semibold text-zinc-700">
                              ${(unitPrice * item.quantity).toLocaleString('es-EC')} <span className="text-[10px] text-zinc-400 font-normal">ref.</span>
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                {/* Subtotal preliminar */}
                <div className="mt-2.5 flex items-center justify-between rounded-lg bg-zinc-100/70 px-3.5 py-2 text-xs">
                  <span className="font-medium text-zinc-600">Subtotal de equipos ({totalUnits} un.):</span>
                  <span className="font-mono font-bold text-brand-dark">
                    ${subtotalAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>

              {/* Sección 2: Flujo según pestaña activa */}
              {activeTab === 'quote' ? (
                /* ================= PESTAÑA COTIZACIÓN ================= */
                <div className="rounded-xl border border-brand-border-soft bg-zinc-50/60 p-4 sm:p-5">
                  {quoteStatus === 'success' && quoteResult ? (
                    /* Confirmación Cotización */
                    <div className="py-4 text-center space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700">
                          {quoteResult.id}
                        </span>
                        <h3 className="mt-1 text-lg font-bold text-brand-dark">
                          ¡Solicitud de Cotización Preparada!
                        </h3>
                        <p className="mt-1 text-xs text-brand-gray max-w-sm mx-auto leading-relaxed">
                          La proforma ha sido registrada para <strong>{quoteResult.customer.fullName}</strong>. Para respuesta inmediata con fichas técnicas y precios oficiales, envíala por nuestro canal directo:
                        </p>
                      </div>

                      <div className="pt-2 flex flex-col gap-2">
                        <Button
                          onClick={handleOpenWhatsapp}
                          className="w-full gap-2 font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Enviar a WhatsApp Oficial (+593)</span>
                        </Button>
                        <Button variant="outline" onClick={handleResetQuote} className="w-full">
                          <RotateCcw className="h-4 w-4" />
                          <span>Nueva Consulta</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Formulario de Cotización */
                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-brand-border-soft pb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-red" />
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                            Datos para Proforma Técnica
                          </span>
                        </div>
                        <span className="text-[11px] text-brand-gray">Respuesta en &lt; 24h</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                            Nombre del Solicitante *
                          </label>
                          <Input
                            placeholder="Ej: Ing. Roberto Dávila"
                            value={customer.fullName}
                            onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                            Empresa / RUC (Opcional)
                          </label>
                          <Input
                            placeholder="Ej: Consorcio Hospitalario Sur"
                            value={customer.companyName}
                            onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                              Teléfono / WhatsApp *
                            </label>
                            <Input
                              placeholder="099 123 4567"
                              value={customer.phone}
                              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                              Correo Corporativo
                            </label>
                            <Input
                              type="email"
                              placeholder="rdavila@empresa.ec"
                              value={customer.email}
                              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                            Ciudad o Ubicación del Proyecto
                          </label>
                          <Input
                            placeholder="Ej: Guayaquil, Hospital del Día"
                            value={customer.cityOrProjectLocation}
                            onChange={(e) => setCustomer({ ...customer, cityOrProjectLocation: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                            Alcance del Proyecto / Requerimientos Especiales
                          </label>
                          <Textarea
                            rows={3}
                            placeholder="Detalles sobre capacidad de flujo, espacio de instalación, normativas requeridas..."
                            value={customer.projectScopeNotes}
                            onChange={(e) => setCustomer({ ...customer, projectScopeNotes: e.target.value })}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!isQuoteFormValid || quoteStatus === 'submitting'}
                        className="w-full gap-2 font-bold py-3 mt-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>{quoteStatus === 'submitting' ? 'Generando Proforma...' : 'Generar Proforma y Enviar por WhatsApp'}</span>
                      </Button>

                      {/* Enlace directo a Pasarela de Pago */}
                      <div className="pt-3 border-t border-brand-border-soft flex items-center justify-between gap-2 text-xs text-brand-gray">
                        <span>¿Prefieres simular compra directa con tarjeta?</span>
                        <button
                          type="button"
                          onClick={handleProceedToCheckout}
                          className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          Seguir al Pago →
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* ================= PESTAÑA PAGO EN LÍNEA: RESUMEN Y BOTÓN SEGUIR AL PAGO ================= */
                <div className="rounded-xl border border-brand-border-soft bg-zinc-50/70 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-border-soft pb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                        Pasarela Digital de Pago
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Simulación Segura
                    </span>
                  </div>

                  {/* Resumen de Montos Financieros */}
                  <div className="rounded-lg bg-white p-3.5 border border-brand-border-soft text-xs space-y-2">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal de equipos ({totalUnits} un.):</span>
                      <span className="font-mono">${subtotalAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>IVA estimado (15% Ecuador):</span>
                      <span className="font-mono">${ivaAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-bold text-brand-dark border-t border-zinc-100 pt-2 text-sm">
                      <span>Total estimado a pagar:</span>
                      <span className="font-mono text-brand-red">${totalAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })} USD</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white p-3.5 border border-brand-border-soft text-xs text-brand-gray space-y-2">
                    <p className="leading-relaxed">
                      El ingreso seguro de tarjeta (Visa, Mastercard, AMEX) y los datos de facturación corporativa se realizan en nuestra <strong>página dedicada de pago</strong> con cifrado TLS y emisión de comprobante digital.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>Cifrado SSL 256-Bit · Emisión de Comprobante Oficial</span>
                    </div>
                  </div>

                  {/* Botón Principal: Seguir al Pago */}
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full gap-2 font-bold py-3.5 bg-brand-dark hover:bg-black text-white shadow-md active:scale-[0.99] cursor-pointer"
                  >
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span>Seguir al Pago con Tarjeta (${totalAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })} USD) →</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>,
    document.body
  )
}
