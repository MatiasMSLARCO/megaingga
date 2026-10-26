import { useParams, Navigate, Link } from 'react-router'
import {
  CheckCircle2,
  FileDown,
  ShieldCheck,
  FileText,
  Camera,
  PenTool,
  Star,
  Download,
  Calendar,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { OrderActivityFeed } from '@/components/portal/OrderActivityFeed'
import { OrderItemsSummary } from '@/components/portal/OrderItemsSummary'
import { OrderProgressTimeline } from '@/components/portal/OrderProgressTimeline'
import { OrderStatusHero } from '@/components/portal/OrderStatusHero'
import { OrderTrackingSkeleton } from '@/components/portal/OrderTrackingSkeleton'
import { LiveTrackingTeaser } from '@/components/portal/LiveTrackingTeaser'
import { useOrder } from '@/hooks/useOrders'
import { useToast } from '@/context/ToastContext'
import { formatOrderDate } from '@/lib/orderStatus'

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data: order, isLoading } = useOrder(orderId)
  const { toast } = useToast()

  if (isLoading) {
    return <OrderTrackingSkeleton />
  }

  if (!order) {
    return <Navigate to="/portal/pedidos" replace />
  }

  const canTrackLive = order.status === 'enviado' || order.status === 'en_camino'
  const isDelivered = order.status === 'entregado'

  const handleDownloadDoc = (docTitle: string) => {
    toast({
      title: 'Descargando documento oficial',
      description: `Generando ${docTitle} para el pedido ${order.id}...`,
      variant: 'info',
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <OrderStatusHero order={order} />

      <OrderProgressTimeline order={order} />

      {canTrackLive && <LiveTrackingTeaser order={order} />}

      {/* Comprobante de Entrega Digital (Proof of Delivery / POD) */}
      {isDelivered && (
        <Card className="border-emerald-500/20 bg-emerald-50/20 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border-soft pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-dark">Comprobante de Entrega en Obra (POD)</h3>
                <p className="text-xs text-brand-gray">Descarga verificada y recibida conforme según guía de remisión.</p>
              </div>
            </div>
            {!order.rated && (
              <Link to={`/portal/pedidos/${order.id}/calificar`}>
                <Button size="sm" className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white">
                  <Star className="h-3.5 w-3.5" />
                  Calificar servicio recibido
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Foto de Entrega */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-brand-dark flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-brand-gray" />
                Registro fotográfico en bodega/obra
              </p>
              <div className="group relative h-40 w-full overflow-hidden rounded-lg border border-brand-border bg-black/5">
                <img
                  src="/assets/images/projects/proyecto-civil-galpones-industriales.webp"
                  alt="Foto comprobante de entrega en bodega"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white backdrop-blur-xs">
                  Foto de recepción física
                </span>
              </div>
            </div>

            {/* Datos del Receptor */}
            <div className="flex flex-col justify-between rounded-lg border border-brand-border-soft bg-white p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">Datos del Receptor</p>
                <p className="mt-2 text-sm font-bold text-brand-dark">
                  {order.pod?.recipientName ?? 'Ing. Carlos Morales'}
                </p>
                <p className="text-xs text-brand-gray">{order.pod?.recipientDoc ?? 'CI 1718293041 · Jefe de Bodega'}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-gray">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  <span>
                    Entregado el:{' '}
                    <strong className="text-brand-dark">
                      {formatOrderDate(order.pod?.deliveredAt ?? order.timeline.find((t) => t.status === 'entregado')?.date ?? order.createdAt)}
                    </strong>
                  </span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-brand-gray/80 italic border-t border-brand-border-soft pt-2">
                &ldquo;{order.pod?.notes ?? 'Material inspeccionado a satisfacción en punto de descarga.'}&rdquo;
              </p>
            </div>

            {/* Firma Digital Registrada */}
            <div className="flex flex-col justify-between rounded-lg border border-brand-border-soft bg-white p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gray flex items-center gap-1">
                  <PenTool className="h-3.5 w-3.5 text-emerald-600" />
                  Firma Digital Registrada
                </p>
                <div className="mt-3 flex h-20 items-center justify-center rounded border border-dashed border-brand-border bg-[#faf9f5]">
                  <span className="font-serif italic text-lg text-brand-dark/70 tracking-widest rotate-[-4deg]">
                    C. Morales R.
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-brand-gray">
                <span>Validado por sistema logístico</span>
                <span className="text-emerald-700 font-semibold">● Verificado</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Documentos Oficiales y Certificados de Calidad */}
      <Card className="p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-red" />
            <h2 className="text-xs font-bold uppercase tracking-wide text-brand-dark">
              Documentos y Certificaciones del Pedido
            </h2>
          </div>
          <span className="text-[11px] text-brand-gray">Formatos oficiales Megaingga & SRI</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-lg border border-brand-border-soft p-3.5 bg-white hover:border-brand-red/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-brand-dark">Factura Electrónica</p>
                <p className="text-[10px] text-brand-gray">SRI Autorizada (PDF/XML)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDownloadDoc('Factura Electrónica')}
              className="p-1.5 text-brand-gray hover:text-brand-red cursor-pointer"
              title="Descargar factura"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-brand-border-soft p-3.5 bg-white hover:border-brand-red/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <FileDown className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-brand-dark">Guía de Remisión</p>
                <p className="text-[10px] text-brand-gray">Despacho de Transporte</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDownloadDoc('Guía de Remisión')}
              className="p-1.5 text-brand-gray hover:text-brand-red cursor-pointer"
              title="Descargar guía de remisión"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-brand-border-soft p-3.5 bg-white hover:border-brand-red/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-brand-dark">Certificados de Calidad</p>
                <p className="text-[10px] text-brand-gray">Normas INEN / Fichas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDownloadDoc('Certificados Técnicos')}
              className="p-1.5 text-brand-gray hover:text-brand-red cursor-pointer"
              title="Descargar certificados"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      <OrderActivityFeed novedades={order.novedades} />

      <OrderItemsSummary items={order.items} />
    </div>
  )
}
