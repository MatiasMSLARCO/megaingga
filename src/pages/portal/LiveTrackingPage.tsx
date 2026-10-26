import { useParams, Link, Navigate } from 'react-router'
import { ArrowLeft, Phone, MessageCircle, Clock3, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { LiveMap } from '@/components/portal/LiveMap'
import { DriverChat } from '@/components/portal/DriverChat'
import { useOrder } from '@/hooks/useOrders'
import { driverMock, routeMock } from '@/data/driver.mock'

export function LiveTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data: order, isLoading } = useOrder(orderId)

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-brand-border-soft/60" />
  }

  if (!order) {
    return <Navigate to="/portal/pedidos" replace />
  }

  const whatsappDigits = driverMock.phone.replace(/\D/g, '')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/portal/pedidos/${order.id}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-gray hover:bg-black/5 hover:text-brand-dark"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-2xl font-semibold text-brand-dark sm:text-3xl">Envío en Vivo</h1>
            {order.projectName && (
              <span className="rounded-full bg-brand-dark/5 px-2.5 py-0.5 text-xs font-semibold text-brand-gray">
                {order.projectName}
              </span>
            )}
          </div>
          <p className="text-sm text-brand-gray">{order.id} · Rastreo del conductor en tiempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Mapa */}
        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="h-[380px] w-full sm:h-[460px]">
            <LiveMap route={routeMock} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border-soft p-4">
            <div className="flex items-center gap-2 text-xs text-brand-gray">
              <Clock3 className="h-4 w-4 text-brand-red" />
              ETA estimada: <span className="font-bold text-brand-dark">{order.deliveryEta ?? 'por confirmar'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-gray">
              <MapPin className="h-4 w-4 text-brand-red" />
              {order.destinationAddress}
            </div>
          </div>
        </Card>

        {/* Columna derecha: conductor + chat */}
        <div className="flex flex-col gap-5">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-sm font-bold text-white">
                {driverMock.avatarInitials}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-brand-dark">{driverMock.name}</p>
                <p className="text-xs text-brand-gray">
                  {driverMock.vehicle} · {driverMock.plate}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={`tel:${driverMock.phone}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-brand-border px-3 py-2 text-xs font-semibold text-brand-dark transition-colors hover:border-brand-red hover:text-brand-red"
              >
                <Phone className="h-3.5 w-3.5" />
                Llamar
              </a>
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </Card>

          <Card className="flex h-[360px] flex-col p-0">
            <div className="border-b border-brand-border-soft px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">Chat con el conductor</p>
            </div>
            <DriverChat conversationId="conv-driver" className="flex-1" />
          </Card>
        </div>
      </div>

      {/* Detalle de productos del envío */}
      <Card className="p-5">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-gray">Productos en este envío</h2>
        <div className="flex flex-col divide-y divide-brand-border-soft">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 py-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-brand-border-soft">
                <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-dark">{item.product.name}</p>
              </div>
              <p className="shrink-0 text-sm font-bold text-brand-dark">x{item.quantity}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
