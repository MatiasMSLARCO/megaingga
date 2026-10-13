import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  FileCheck2,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  Printer,
  Receipt,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { companyInfo } from '@/data/company.data'
import { calculateOrderTotal, estimateUnitPrice, processPayment } from '@/services/payment.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { InteractiveCreditCard } from '@/components/quote/InteractiveCreditCard'
import type { CardDetails, PaymentResult } from '@/types/payment.types'
import type { QuoteItem } from '@/types/quote.types'
import type { AppOutletContext } from '@/types/outlet-context.types'

interface BillingCustomerData {
  companyOrName: string
  rucOrId: string
  email: string
  phone: string
  city: string
  address: string
}

const INITIAL_BILLING: BillingCustomerData = {
  companyOrName: '',
  rucOrId: '',
  email: '',
  phone: '',
  city: '',
  address: '',
}

const INITIAL_CARD: CardDetails = {
  cardholderName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function buildCheckoutWhatsappMessage(
  orderId: string,
  billing: BillingCustomerData,
  last4: string,
  total: number,
  items: QuoteItem[]
): string {
  const lines = [
    `*COMPROBANTE DE COMPRA EN LÍNEA (DEMO) — MEGA INGENIERÍA*`,
    `No. de Orden: *${orderId}*`,
    `Fecha: ${new Date().toLocaleDateString('es-EC')}`,
    '------------------------------------------',
    `*Datos del Cliente / Empresa:*`,
    `• Nombre / Razón Social: ${billing.companyOrName}`,
    billing.rucOrId ? `• RUC / Cédula: ${billing.rucOrId}` : '',
    billing.phone ? `• Teléfono: ${billing.phone}` : '',
    billing.email ? `• Correo: ${billing.email}` : '',
    billing.city ? `• Ciudad: ${billing.city}` : '',
    '------------------------------------------',
    `*Equipos Adquiridos:*`,
    ...items.map(
      (item) =>
        `• ${item.product.name} (Cant: ${item.quantity} un.) — Subtotal est.: $${formatCurrency(
          estimateUnitPrice(item.product.division) * item.quantity
        )}`
    ),
    '------------------------------------------',
    `*Total Pagado (Demo):* $${formatCurrency(total)} USD`,
    `*Tarjeta:* **** ${last4}`,
    '',
    'Favor confirmar recepción del requerimiento y tiempos de despacho.'
  ]

  return lines.filter(Boolean).join('\n')
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, onUpdateQuantity, onRemove, onClear } = useOutletContext<AppOutletContext>()

  // Estado del formulario de facturación
  const [billing, setBilling] = useState<BillingCustomerData>(INITIAL_BILLING)

  // Estado de la tarjeta y pasarela
  const [card, setCard] = useState<CardDetails>(INITIAL_CARD)
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [maskNumbers, setMaskNumbers] = useState(true)
  const [showCardNumberInput, setShowCardNumberInput] = useState(false)
  const [showCvvInput, setShowCvvInput] = useState(false)
  const [payStatus, setPayStatus] = useState<'form' | 'processing' | 'success'>('form')
  const [payError, setPayError] = useState<string | null>(null)
  const [payResult, setPayResult] = useState<PaymentResult | null>(null)

  // Copia de respaldo de ítems para mostrar en el voucher una vez limpiado el carrito
  const [completedOrderItems, setCompletedOrderItems] = useState<QuoteItem[]>([])
  const [completedOrderBilling, setCompletedOrderBilling] = useState<BillingCustomerData>(INITIAL_BILLING)
  const [transactionTimestamp, setTransactionTimestamp] = useState<string>('')

  useEffect(() => {
    document.title = 'Pasarela de Pago Digital (Demo) · Mega Ingeniería'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Mega Ingeniería'
    }
  }, [])

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotalAmount = calculateOrderTotal(items)
  const ivaAmount = subtotalAmount * 0.15
  const totalAmount = subtotalAmount + ivaAmount

  const handleFillDemoData = () => {
    setBilling({
      companyOrName: 'HOSPITAL METROPOLITANO QUITO',
      rucOrId: '1790012345001',
      email: 'compras@hospitalmetropolitano.org',
      phone: '0998314070',
      city: 'Quito - Pichincha',
      address: 'Av. Mariana de Jesús s/n y Nicolás Arteta',
    })
    setCard({
      cardholderName: 'ING. CARLOS MENDOZA',
      cardNumber: '4535 3453 4534 5435',
      expiry: '12/28',
      cvv: '345',
    })
  }

  const handlePaySubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setPayStatus('processing')
    setPayError(null)

    const effectiveCard: CardDetails = {
      cardholderName: card.cardholderName.trim() || 'USUARIO DEMO',
      cardNumber: card.cardNumber.replace(/\s/g, '').length >= 4 ? card.cardNumber : '4535 3453 4534 5435',
      expiry: card.expiry.trim() || '12/28',
      cvv: card.cvv.trim() || '345',
    }

    const effectiveBilling: BillingCustomerData = {
      companyOrName: billing.companyOrName.trim() || 'CLIENTE CORPORATIVO DEMO',
      rucOrId: billing.rucOrId.trim() || '1790012345001',
      email: billing.email.trim() || 'contacto@empresa.ec',
      phone: billing.phone.trim() || '0998314070',
      city: billing.city.trim() || 'Quito',
      address: billing.address.trim() || 'Dirección de Proyecto Demo',
    }

    try {
      const res = await processPayment(items, effectiveCard)
      setPayResult(res)
      setCompletedOrderItems([...items])
      setCompletedOrderBilling(effectiveBilling)
      setTransactionTimestamp(
        new Date().toLocaleString('es-EC', {
          dateStyle: 'medium',
          timeStyle: 'medium',
        })
      )
      setPayStatus('success')
      // Limpiar carrito activo tras compra exitosa
      onClear()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Error al procesar la transacción.')
      setPayStatus('form')
    }
  }

  const handleOpenWhatsappConfirmation = () => {
    if (!payResult) return
    const text = buildCheckoutWhatsappMessage(
      payResult.orderId,
      completedOrderBilling,
      payResult.last4,
      payResult.amount,
      completedOrderItems
    )
    window.open(`https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handlePrintVoucher = () => {
    window.print()
  }

  // =========================================================
  // VISTA: PAGO EXITOSO / VOUCHER DIGITAL
  // =========================================================
  if (payStatus === 'success' && payResult) {
    const voucherSubtotal = completedOrderItems.reduce(
      (sum, item) => sum + estimateUnitPrice(item.product.division) * item.quantity,
      0
    )
    const voucherIva = voucherSubtotal * 0.15
    const voucherTotal = voucherSubtotal + voucherIva

    return (
      <div className="min-h-screen bg-zinc-50/70 pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Tarjeta de Éxito y Resumen */}
          <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-xl">
            {/* Cabecera del Voucher */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 p-6 sm:p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
                  <CheckCircle2 className="h-10 w-10 text-emerald-300" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100 border border-emerald-400/30">
                    <Sparkles className="h-3.5 w-3.5" />
                    Transacción Aprobada (Demo)
                  </span>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                    ¡Comprobante de Pago Digital!
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-emerald-100">
                    Orden de compra registrada con éxito en el sistema B2B.
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right bg-white/10 px-4 py-3 rounded-xl backdrop-blur-xs border border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-200 block">
                  CÓDIGO DE ORDEN
                </span>
                <span className="text-lg sm:text-xl font-mono font-bold tracking-wider text-white">
                  {payResult.orderId}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Tarjeta Visual de Pago */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-xl bg-zinc-50 border border-brand-border-soft p-6">
                <div className="w-full max-w-sm">
                  <InteractiveCreditCard
                    cardNumber={card.cardNumber || '4535 3453 4534 5435'}
                    cardholderName={card.cardholderName || 'USUARIO DEMO'}
                    expiry={card.expiry || '12/28'}
                    cvv={card.cvv || '345'}
                    isFlipped={false}
                    isSuccess={true}
                  />
                </div>

                <div className="flex-1 space-y-3 text-sm">
                  <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-emerald-600" />
                    Detalles de la Transacción Bancaria
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-white p-3 border border-zinc-200">
                      <span className="text-brand-gray block">Tarjeta Utilizada:</span>
                      <span className="font-bold text-brand-dark">
                        Visa / Mastercard Demo (**** {payResult.last4})
                      </span>
                    </div>
                    <div className="rounded-lg bg-white p-3 border border-zinc-200">
                      <span className="text-brand-gray block">Fecha y Hora:</span>
                      <span className="font-bold text-brand-dark">{transactionTimestamp}</span>
                    </div>
                    <div className="rounded-lg bg-white p-3 border border-zinc-200">
                      <span className="text-brand-gray block">Titular:</span>
                      <span className="font-bold text-brand-dark">
                        {card.cardholderName || completedOrderBilling.companyOrName || 'CLIENTE B2B'}
                      </span>
                    </div>
                    <div className="rounded-lg bg-white p-3 border border-zinc-200">
                      <span className="text-brand-gray block">RUC / C.I.:</span>
                      <span className="font-bold text-brand-dark">
                        {completedOrderBilling.rucOrId || 'Consumidor Final (Demo)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desglose de Equipos Adquiridos */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-3 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-brand-red" />
                  Equipos y Soluciones Incluidas ({completedOrderItems.length})
                </h3>

                <div className="overflow-hidden rounded-xl border border-brand-border-soft bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-brand-border-soft text-brand-gray uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Equipo / Solución</th>
                        <th className="py-3 px-4 text-center">Cant.</th>
                        <th className="py-3 px-4 text-right">P. Unitario (Demo)</th>
                        <th className="py-3 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border-soft">
                      {completedOrderItems.map((item) => {
                        const unitPrice = estimateUnitPrice(item.product.division)
                        const lineTotal = unitPrice * item.quantity
                        return (
                          <tr key={item.productId} className="hover:bg-zinc-50/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="h-10 w-10 rounded-md object-cover border border-zinc-200 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-brand-dark line-clamp-1">{item.product.name}</p>
                                  <p className="text-[11px] text-brand-gray">{item.product.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-brand-dark">{item.quantity}</td>
                            <td className="py-3 px-4 text-right font-mono text-zinc-600">
                              ${formatCurrency(unitPrice)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-brand-dark">
                              ${formatCurrency(lineTotal)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  {/* Totales */}
                  <div className="bg-zinc-50/90 p-4 border-t border-brand-border-soft">
                    <div className="max-w-xs ml-auto space-y-1.5 text-xs">
                      <div className="flex justify-between text-zinc-600">
                        <span>Subtotal equipos:</span>
                        <span className="font-mono">${formatCurrency(voucherSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-600">
                        <span>IVA estimado (15%):</span>
                        <span className="font-mono">${formatCurrency(voucherIva)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-600">
                        <span>Flete e instalación en obra:</span>
                        <span className="font-semibold text-emerald-700">Coordinación directa</span>
                      </div>
                      <div className="flex justify-between border-t border-zinc-200 pt-2 text-sm font-bold text-brand-dark">
                        <span>Monto Total Cancelado:</span>
                        <span className="font-mono text-brand-red text-base">
                          ${formatCurrency(voucherTotal)} USD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-brand-border-soft">
                <Button
                  variant="outline"
                  onClick={handlePrintVoucher}
                  className="w-full sm:w-auto gap-2 text-xs font-bold"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir Comprobante
                </Button>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <Button
                    onClick={handleOpenWhatsappConfirmation}
                    className="gap-2 text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar a WhatsApp Oficial
                  </Button>

                  <Button
                    onClick={() => navigate('/tienda')}
                    className="gap-2 text-xs font-bold bg-brand-dark hover:bg-black text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Volver al Catálogo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================
  // VISTA: CARRITO VACÍO
  // =========================================================
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 text-brand-dark mb-6">
            <ShoppingBag className="h-10 w-10 text-brand-gray" />
          </div>

          <span className="inline-block rounded-full bg-brand-border-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-gray">
            Pasarela Digital de Pago
          </span>

          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-brand-dark">
            Tu Mesa de Pedido está Vacía
          </h1>

          <p className="mt-3 text-sm text-brand-gray leading-relaxed max-w-lg mx-auto">
            Para procesar una orden de compra o simular el pago digital con tarjeta de crédito, selecciona primero los
            equipos hospitalarios o de climatización desde nuestra tienda técnica.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={() => navigate('/tienda')} className="w-full sm:w-auto gap-2 font-bold px-6 py-3">
              <ShoppingBag className="h-4 w-4" />
              Explorar Tienda Técnica
            </Button>

            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 font-medium px-6 py-3">
                <ArrowLeft className="h-4 w-4" />
                Regresar al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================
  // VISTA PRINCIPAL: CHECKOUT EN DOS COLUMNAS
  // =========================================================
  return (
    <div className="min-h-screen bg-zinc-50/60 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Encabezado */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs font-medium text-brand-gray mb-3">
            <Link to="/" className="hover:text-brand-red transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/tienda" className="hover:text-brand-red transition-colors">
              Tienda
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-brand-dark font-bold">Pasarela de Pago Digital</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
                <CreditCard className="h-3.5 w-3.5" />
                Ambiente de Pruebas Seguro (Demo B2B)
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tight text-brand-dark">
                Pasarela Digital de Pago
              </h1>
            </div>

            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gray hover:text-brand-red transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continuar Seleccionando Equipos
            </Link>
          </div>
        </div>

        {/* Disclaimer / Aviso de Modo Prueba (Principio III) */}
        <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">
              Aviso Importante: Pasarela de demostración 100% simulada
            </p>
            <p className="leading-relaxed text-amber-800">
              Esta pasarela digital simula la experiencia de compra inmediata para adquisición de equipamiento de ingeniería.
              <strong> Ningún cargo real será debitado</strong> de su cuenta bancaria y los datos ingresados no se envían a pasarelas externas.
              Los precios unitarios reflejados son montos referenciales de demo.
            </p>
          </div>
        </div>

        {/* Layout en 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA: FORMULARIOS DE FACTURACIÓN Y PAGO     */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePaySubmit} className="space-y-6">
              {/* Tarjeta 1: Datos de Facturación B2B */}
              <div className="rounded-2xl border border-brand-border-soft bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-border-soft pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-brand-dark">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-brand-dark">1. Datos de Facturación Corporativa</h2>
                      <p className="text-xs text-brand-gray">Para emisión de comprobante y coordinación fiscal</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFillDemoData}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Llenar Datos Demo Rápidos</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                      Razón Social o Nombre del Comprador *
                    </label>
                    <Input
                      placeholder="Ej: HOSPITAL METROPOLITANO / CLÍNICA SAN JOSÉ"
                      value={billing.companyOrName}
                      onChange={(e) => setBilling({ ...billing, companyOrName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                      RUC o Cédula de Identidad *
                    </label>
                    <Input
                      placeholder="1790012345001"
                      maxLength={13}
                      value={billing.rucOrId}
                      onChange={(e) => setBilling({ ...billing, rucOrId: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                      Teléfono de Contacto Técnico *
                    </label>
                    <Input
                      placeholder="0998314070"
                      value={billing.phone}
                      onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                      Correo Electrónico para Factura *
                    </label>
                    <Input
                      type="email"
                      placeholder="compras@institucion.org"
                      value={billing.email}
                      onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                      Ciudad / Ubicación del Proyecto
                    </label>
                    <Input
                      placeholder="Quito / Guayaquil / Cuenca"
                      value={billing.city}
                      onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Formulario de Pago y Tarjeta Interactiva */}
              <div className="rounded-2xl border border-brand-border-soft bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between border-b border-brand-border-soft pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red text-white">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-brand-dark">2. Método de Pago con Tarjeta (Demo)</h2>
                      <p className="text-xs text-brand-gray">Acepta Visa, Mastercard, American Express</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Lock className="h-3 w-3" />
                    Cifrado Seguro
                  </span>
                </div>

                {/* Vista Previa 3D de la Tarjeta Interactiva */}
                <div className="py-4 bg-zinc-50/80 rounded-xl border border-zinc-200/80 mb-6">
                  <InteractiveCreditCard
                    cardNumber={card.cardNumber}
                    cardholderName={card.cardholderName}
                    expiry={card.expiry}
                    cvv={card.cvv}
                    isFlipped={isCardFlipped}
                    onToggleFlip={() => setIsCardFlipped((f) => !f)}
                    maskNumbers={maskNumbers}
                    onToggleMask={() => setMaskNumbers((m) => !m)}
                  />
                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-medium text-zinc-500">
                    <span>
                      {isCardFlipped
                        ? 'Reverso protegido (CVV enmascarado como ***)'
                        : 'Frente protegido: códigos ocultos como **** por seguridad'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMaskNumbers((m) => !m)}
                      className="text-brand-dark underline font-bold hover:text-brand-red cursor-pointer"
                    >
                      {maskNumbers ? '(Ver dígitos)' : '(Ocultar con ****)'}
                    </button>
                  </div>
                </div>

                {/* Campos de la Tarjeta */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                      Nombre del Titular de la Tarjeta *
                    </label>
                    <Input
                      placeholder="Ej: ING. CARLOS MENDOZA"
                      value={card.cardholderName}
                      onFocus={() => setIsCardFlipped(false)}
                      onChange={(e) => setCard({ ...card, cardholderName: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
                        Número de Tarjeta (16 dígitos) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCardNumberInput((s) => !s)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-brand-dark transition-colors cursor-pointer"
                      >
                        {showCardNumberInput ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span>{showCardNumberInput ? 'Ocultar con ••••' : 'Ver dígitos'}</span>
                      </button>
                    </div>
                    <Input
                      type={showCardNumberInput ? 'text' : 'password'}
                      placeholder="4535 3453 4534 5435"
                      maxLength={19}
                      value={card.cardNumber}
                      onFocus={() => setIsCardFlipped(false)}
                      onChange={(e) => setCard({ ...card, cardNumber: formatCardNumber(e.target.value) })}
                    />
                    <p className="mt-1 text-[11px] text-zinc-400">
                      Cualquier número válido para demo. Enmascarado como **** por privacidad.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                        Vencimiento (MM/AA) *
                      </label>
                      <Input
                        placeholder="12/28"
                        maxLength={5}
                        value={card.expiry}
                        onFocus={() => setIsCardFlipped(false)}
                        onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
                          CVV / CVC (3 o 4 dígitos) *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCvvInput((s) => !s)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-brand-dark transition-colors cursor-pointer"
                          title={showCvvInput ? 'Ocultar CVV' : 'Mostrar CVV'}
                        >
                          {showCvvInput ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <Input
                        type={showCvvInput ? 'text' : 'password'}
                        placeholder="345"
                        maxLength={4}
                        value={card.cvv}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={() => setIsCardFlipped(false)}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      />
                    </div>
                  </div>
                </div>

                {payError && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{payError}</span>
                  </div>
                )}

                {/* Botón de Enviar Pago */}
                <div className="mt-6 pt-5 border-t border-brand-border-soft">
                  <Button
                    type="submit"
                    disabled={payStatus === 'processing'}
                    className="w-full gap-2.5 font-bold py-4 text-sm bg-brand-dark hover:bg-black text-white shadow-md active:scale-[0.99] cursor-pointer"
                  >
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span>
                      {payStatus === 'processing'
                        ? 'Procesando Transacción Segura...'
                        : `Simular Pago Seguro de $${formatCurrency(totalAmount)} USD`}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Sellos de Confianza y Estándares B2B */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-brand-border-soft bg-white p-3.5 flex items-center justify-center gap-2.5 text-xs text-brand-gray">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-brand-dark">Cifrado SSL 256-Bit</span>
                </div>
                <div className="rounded-xl border border-brand-border-soft bg-white p-3.5 flex items-center justify-center gap-2.5 text-xs text-brand-gray">
                  <FileCheck2 className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-brand-dark">Facturación SRI Demo</span>
                </div>
                <div className="rounded-xl border border-brand-border-soft bg-white p-3.5 flex items-center justify-center gap-2.5 text-xs text-brand-gray">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold text-brand-dark">Garantía MegaIngga</span>
                </div>
              </div>
            </form>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA DERECHA: RESUMEN DE COMPRA Y EQUIPOS              */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 rounded-2xl border border-brand-border-soft bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border-soft pb-4">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="h-5 w-5 text-brand-red" />
                  <h2 className="text-base font-bold text-brand-dark">Resumen del Pedido</h2>
                </div>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-700">
                  {totalUnits} unidades
                </span>
              </div>

              {/* Lista de Equipos */}
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => {
                  const unitPrice = estimateUnitPrice(item.product.division)
                  const lineTotal = unitPrice * item.quantity
                  return (
                    <div
                      key={item.productId}
                      className="flex gap-3 rounded-xl border border-brand-border-soft p-3 hover:border-zinc-300 transition-colors bg-zinc-50/40"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-lg object-cover border border-zinc-200 shrink-0"
                      />

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="text-xs font-bold text-brand-dark leading-snug line-clamp-1">
                              {item.product.name}
                            </h4>
                            <span className="text-[10px] text-brand-gray uppercase tracking-wider">
                              {item.product.category}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemove(item.productId)}
                            className="text-zinc-400 hover:text-brand-red transition-colors p-0.5 cursor-pointer"
                            title="Eliminar del pedido"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          {/* Stepper de cantidad */}
                          <div className="flex items-center gap-1 rounded border border-brand-border bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                              aria-label="Disminuir"
                              className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-brand-dark">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                              aria-label="Aumentar"
                              className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-xs font-bold text-brand-dark">
                              ${formatCurrency(lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desglose de Precios */}
              <div className="space-y-2 border-t border-brand-border-soft pt-4 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal de equipos:</span>
                  <span className="font-mono">${formatCurrency(subtotalAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>IVA estimado (15% Ecuador):</span>
                  <span className="font-mono">${formatCurrency(ivaAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Entrega en obra / Instalación:</span>
                  <span className="font-semibold text-emerald-700">Por coordinar (Demo)</span>
                </div>

                <div className="flex justify-between border-t border-brand-border-soft pt-3 text-sm font-bold text-brand-dark">
                  <span>Total estimado a pagar:</span>
                  <span className="font-mono text-brand-red text-base">
                    ${formatCurrency(totalAmount)} USD
                  </span>
                </div>
              </div>

              {/* Beneficios Corporativos B2B */}
              <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200/80 text-xs space-y-2.5">
                <div className="font-bold text-brand-dark uppercase tracking-wider text-[11px]">
                  Respaldo Técnico MegaIngga
                </div>
                <ul className="space-y-1.5 text-brand-gray text-[11px]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Garantía técnica de 12 a 24 meses según fabricante</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Fichas técnicas y protocolos de validación incluidos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Soporte de ingeniería y montaje especializado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}