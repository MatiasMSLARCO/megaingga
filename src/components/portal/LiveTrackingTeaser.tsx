import { Link } from 'react-router'
import { Clock3, MapPin, Radio } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { driverMock } from '@/data/driver.mock'
import type { Order } from '@/types/order.types'

interface LiveTrackingTeaserProps {
  order: Order
}

export function LiveTrackingTeaser({ order }: LiveTrackingTeaserProps) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-brand-red/20 bg-brand-red/5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-50" />
          <Radio className="relative h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-brand-dark">Tu pedido está en camino</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-gray">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5 text-brand-red" />
              ETA {order.deliveryEta ?? 'por confirmar'}
            </span>
            {order.destinationAddress && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-red" />
                {order.destinationAddress}
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-brand-gray">
            {driverMock.name} · {driverMock.vehicle}
          </p>
        </div>
      </div>
      <Link to={`/portal/pedidos/${order.id}/envio`} className="shrink-0">
        <Button className="w-full sm:w-auto">Ver envío en vivo</Button>
      </Link>
    </div>
  )
}
