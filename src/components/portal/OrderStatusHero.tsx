import { useState } from 'react'
import { AlertTriangle, Check, Copy, FileDown, MessageCircle, Share2, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { companyInfo } from '@/data/company.data'
import { useReportIncident } from '@/hooks/useOrders'
import { useToast } from '@/context/ToastContext'
import { ORDER_STATUS_BADGE, ORDER_STATUS_DESCRIPTIONS, ORDER_STATUS_LABELS, formatOrderDate } from '@/lib/orderStatus'
import type { Order } from '@/types/order.types'

interface OrderStatusHeroProps {
  order: Order
}

export function OrderStatusHero({ order }: OrderStatusHeroProps) {
  const [copied, setCopied] = useState(false)
  const [incidentModalOpen, setIncidentModalOpen] = useState(false)
  const [incidentType, setIncidentType] = useState('Duda de entrega')
  const [incidentText, setIncidentText] = useState('')
  const reportIncident = useReportIncident()
  const { toast } = useToast()

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(order.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard no disponible
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/portal/pedidos/${order.id}`
    if (navigator.share) {
      try {
        await navigator.share({ title: `Pedido ${order.id}`, url })
        return
      } catch {
        // Fallback
      }
    }
    await navigator.clipboard.writeText(url).catch(() => undefined)
    toast({
      title: 'Enlace copiado',
      description: 'El link de rastreo fue copiado al portapapeles.',
      variant: 'info',
    })
  }

  const handleDownloadInvoice = () => {
    toast({
      title: 'Descargando comprobante SRI',
      description: `Generando Factura Electrónica autorizada para ${order.id}...`,
      variant: 'info',
    })
  }

  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault()
    if (!incidentText.trim()) return

    reportIncident.mutate(
      { orderId: order.id, tipo: incidentType, detalle: incidentText.trim() },
      {
        onSuccess: () => {
          toast({
            title: 'Novedad enviada',
            description: 'Tu reporte fue registrado en el seguimiento y notificado al supervisor logístico.',
            variant: 'success',
          })
          setIncidentModalOpen(false)
          setIncidentText('')
        },
      }
    )
  }

  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    `Hola, tengo una consulta sobre mi pedido ${order.id} (${order.projectName ?? 'Suministro Megaingga'})`
  )}`

  return (
    <>
      <Card className="flex flex-col gap-4 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Rastreo de Pedido</p>
              {order.projectName && (
                <span className="rounded-full bg-brand-dark/5 px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                  {order.projectName}
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl font-semibold text-brand-dark sm:text-3xl">{order.id}</h1>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-brand-gray transition-colors hover:bg-black/5 hover:text-brand-dark"
                aria-label="Copiar número de pedido"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="mt-1 text-sm text-brand-gray">Creado el {formatOrderDate(order.createdAt)}</p>
          </div>
          <Badge variant={ORDER_STATUS_BADGE[order.status]} className="shrink-0 text-xs py-1 px-3">
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>

        <p className="text-sm text-brand-gray">{ORDER_STATUS_DESCRIPTIONS[order.status]}</p>

        <div className="flex flex-wrap items-center gap-2 border-t border-brand-border-soft pt-4">
          <Button variant="outline" size="sm" onClick={handleShare} className="text-xs">
            <Share2 className="h-3.5 w-3.5" />
            Compartir rastreo
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownloadInvoice} className="text-xs">
            <FileDown className="h-3.5 w-3.5" />
            Factura SRI (PDF)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIncidentModalOpen(true)}
            className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Reportar novedad en obra
          </Button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-brand-border px-3 text-xs font-semibold text-brand-dark transition-colors hover:border-brand-red hover:text-brand-red"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Soporte WhatsApp
          </a>
        </div>
      </Card>

      {/* Modal para reportar novedad en obra */}
      {incidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-border-soft pb-3">
              <div className="flex items-center gap-2 text-brand-dark">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold">Reportar novedad en obra</h3>
              </div>
              <button
                type="button"
                onClick={() => setIncidentModalOpen(false)}
                className="text-brand-gray hover:text-brand-dark"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIncident} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-brand-dark block mb-1">Tipo de novedad</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="h-9 w-full rounded-md border border-brand-border bg-white px-3 text-xs text-brand-dark outline-none focus:border-brand-red"
                >
                  <option value="Duda de entrega o acceso">Dificultad de acceso / Garita</option>
                  <option value="Material faltante">Material o producto faltante</option>
                  <option value="Daño en transporte">Daño físico durante transporte</option>
                  <option value="Cambio de receptor en obra">Cambio de persona que recibe</option>
                  <option value="Otro">Otro requerimiento</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-dark block mb-1">Descripción del reporte</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalla lo sucedido con el pedido o instrucciones especiales..."
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  className="w-full rounded-md border border-brand-border p-2.5 text-xs text-brand-dark outline-none focus:border-brand-red"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIncidentModalOpen(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={reportIncident.isPending}
                  className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {reportIncident.isPending ? 'Enviando...' : 'Registrar reporte'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
