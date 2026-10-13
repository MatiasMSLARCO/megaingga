import { type FormEvent, useState } from 'react'
import { AlertTriangle, CheckCircle2, CreditCard, ShieldAlert } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { calculateOrderTotal, processPayment } from '@/services/payment.service'
import type { CardDetails, PaymentResult } from '@/types/payment.types'
import type { QuoteItem } from '@/types/quote.types'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  items: QuoteItem[]
  onSuccess?: () => void
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

export function PaymentModal({ isOpen, onClose, items, onSuccess }: PaymentModalProps) {
  const [card, setCard] = useState<CardDetails>(INITIAL_CARD)
  const [status, setStatus] = useState<'form' | 'processing' | 'success'>('form')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PaymentResult | null>(null)

  const total = calculateOrderTotal(items)
  const isValid =
    card.cardholderName.trim().length > 0 &&
    card.cardNumber.replace(/\s/g, '').length >= 13 &&
    card.expiry.length === 5 &&
    card.cvv.length >= 3

  const handleClose = () => {
    onClose()
    setCard(INITIAL_CARD)
    setStatus('form')
    setError(null)
    setResult(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || items.length === 0) return

    setError(null)
    setStatus('processing')
    try {
      const paymentResult = await processPayment(items, card)
      setResult(paymentResult)
      setStatus('success')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar el pago.')
      setStatus('form')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Comprar Ahora">
      <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <p>
          <span className="font-bold">Ambiente de pruebas.</span> Esta pasarela de pago es 100% simulada: no procesa
          cobros reales ni envía tus datos a ningún servidor. No ingreses datos de una tarjeta real.
        </p>
      </div>

      {status === 'success' && result ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-lg font-bold text-brand-dark">Pago simulado aprobado</p>
          <p className="text-sm text-brand-gray">
            Orden: <span className="font-mono font-semibold text-brand-dark">{result.orderId}</span>
          </p>
          <p className="text-sm text-brand-gray">
            Monto (demo): <span className="font-semibold text-brand-dark">${result.amount.toLocaleString('es-EC')}</span>{' '}
            · Tarjeta terminada en {result.last4}
          </p>
          <p className="max-w-sm text-xs text-brand-gray">
            Esto es una simulación para fines de demostración. Nuestro equipo te contactará para formalizar la compra.
          </p>
          <Button onClick={handleClose} className="mt-2">
            Cerrar
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-md bg-brand-border-soft/60 px-3 py-2.5 text-sm">
            <span className="text-brand-gray">
              {items.length} producto{items.length !== 1 && 's'} seleccionado{items.length !== 1 && 's'}
            </span>
            <span className="font-bold text-brand-dark">${total.toLocaleString('es-EC')} (demo)</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-brand-red/30 bg-brand-red/5 px-3 py-2 text-xs text-brand-red">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Input
            label="Nombre del titular"
            required
            value={card.cardholderName}
            onChange={(e) => setCard((c) => ({ ...c, cardholderName: e.target.value }))}
          />
          <Input
            label="Número de tarjeta"
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            required
            value={card.cardNumber}
            onChange={(e) => setCard((c) => ({ ...c, cardNumber: formatCardNumber(e.target.value) }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Vencimiento (MM/AA)"
              placeholder="12/28"
              inputMode="numeric"
              required
              value={card.expiry}
              onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
            />
            <Input
              label="CVV"
              placeholder="123"
              inputMode="numeric"
              required
              value={card.cvv}
              onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
            />
          </div>

          <Button type="submit" disabled={!isValid || status === 'processing'} className="mt-2">
            <CreditCard className="h-4 w-4" />
            {status === 'processing' ? 'Procesando pago simulado...' : `Pagar $${total.toLocaleString('es-EC')} (demo)`}
          </Button>
        </form>
      )}
    </Modal>
  )
}
