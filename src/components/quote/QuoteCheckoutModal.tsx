import { type FormEvent, useState } from 'react'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { submitQuoteRequest } from '@/services/quote.service'
import { companyInfo } from '@/data/company.data'
import type { QuoteCustomerData, QuoteItem, QuoteRequest } from '@/types/quote.types'

interface QuoteCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  items: QuoteItem[]
  onSuccess: () => void
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
    `*Solicitud de Cotización ${request.id}*`,
    `Cliente: ${request.customer.fullName}`,
    request.customer.companyName && `Empresa: ${request.customer.companyName}`,
    request.customer.email && `Correo: ${request.customer.email}`,
    request.customer.phone && `Teléfono: ${request.customer.phone}`,
    request.customer.cityOrProjectLocation && `Ubicación del proyecto: ${request.customer.cityOrProjectLocation}`,
    '',
    '*Productos solicitados:*',
    ...request.items.map((item) => `• ${item.product.name} (Cantidad: ${item.quantity})`),
  ]

  if (request.customer.projectScopeNotes) {
    lines.push('', `Notas: ${request.customer.projectScopeNotes}`)
  }

  return lines.filter(Boolean).join('\n')
}

export function QuoteCheckoutModal({ isOpen, onClose, items, onSuccess }: QuoteCheckoutModalProps) {
  const [customer, setCustomer] = useState<QuoteCustomerData>(INITIAL_CUSTOMER)
  const [status, setStatus] = useState<'form' | 'submitting' | 'success'>('form')
  const [result, setResult] = useState<QuoteRequest | null>(null)

  const isValid = customer.fullName.trim().length > 0 && (customer.email.trim().length > 0 || customer.phone.trim().length > 0)

  const handleClose = () => {
    onClose()
    setStatus('form')
    setCustomer(INITIAL_CUSTOMER)
    setResult(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || items.length === 0) return

    setStatus('submitting')
    const request = await submitQuoteRequest(customer, items)
    setResult(request)
    setStatus('success')
  }

  const handleSendWhatsapp = () => {
    if (!result) return
    const text = buildWhatsappMessage(result)
    window.open(`https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank')
    onSuccess()
    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Solicitud de Cotización RFQ">
      {status === 'success' && result ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-lg font-bold text-brand-dark">Cotización generada</p>
          <p className="text-sm text-brand-gray">
            Folio: <span className="font-mono font-semibold text-brand-dark">{result.id}</span>
          </p>
          <p className="max-w-sm text-sm text-brand-gray">
            Envía tu solicitud por WhatsApp corporativo para que nuestro equipo te contacte con la propuesta.
          </p>
          <Button onClick={handleSendWhatsapp} className="mt-2">
            <MessageCircle className="h-4 w-4" />
            Enviar por WhatsApp
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-xs text-brand-gray">
            {items.length} producto{items.length !== 1 && 's'} en tu solicitud · Completa tus datos para generar el folio RFQ.
          </p>
          <Input
            label="Nombre completo"
            required
            value={customer.fullName}
            onChange={(e) => setCustomer((c) => ({ ...c, fullName: e.target.value }))}
          />
          <Input
            label="Empresa"
            value={customer.companyName}
            onChange={(e) => setCustomer((c) => ({ ...c, companyName: e.target.value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Correo electrónico"
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
            />
            <Input
              label="Teléfono"
              type="tel"
              value={customer.phone}
              onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
            />
          </div>
          <Input
            label="Ciudad / Ubicación del proyecto"
            value={customer.cityOrProjectLocation}
            onChange={(e) => setCustomer((c) => ({ ...c, cityOrProjectLocation: e.target.value }))}
          />
          <Textarea
            label="Notas del proyecto (opcional)"
            value={customer.projectScopeNotes}
            onChange={(e) => setCustomer((c) => ({ ...c, projectScopeNotes: e.target.value }))}
          />
          <Button type="submit" disabled={!isValid || status === 'submitting'} className="mt-2">
            {status === 'submitting' ? 'Generando folio...' : 'Generar Cotización'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
