import { CheckCircle2, FileText, Navigation, PackageCheck, PackageSearch, Truck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatOrderDate } from '@/lib/orderStatus'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { Order, OrderStatus } from '@/types/order.types'

const STEP_ICON: Record<OrderStatus, typeof FileText> = {
  cotizando: FileText,
  aceptado: CheckCircle2,
  preparacion: PackageSearch,
  enviado: PackageCheck,
  en_camino: Truck,
  entregado: Navigation,
}

interface OrderProgressTimelineProps {
  order: Order
}

export function OrderProgressTimeline({ order }: OrderProgressTimelineProps) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
        {order.timeline.map((step, index) => {
          const Icon = STEP_ICON[step.status]
          const isCurrent = step.status === order.status
          const nextDone = order.timeline[index + 1]?.done ?? false

          return (
            <div key={step.status} className="flex flex-1 sm:flex-col">
              <div className="flex flex-col items-center sm:w-full">
                <div className="flex w-full items-center sm:flex-col">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                    {isCurrent && !reducedMotion && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red/50" />
                    )}
                    <span
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                        step.done
                          ? isCurrent
                            ? 'border-brand-red bg-brand-red text-white'
                            : 'border-brand-dark bg-brand-dark text-white'
                          : 'border-brand-border bg-white text-brand-border'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                  </span>
                  {index < order.timeline.length - 1 && (
                    <span
                      className={`h-0.5 flex-1 transition-colors duration-500 sm:mt-5 ${
                        step.done && nextDone ? 'bg-brand-dark' : 'bg-brand-border'
                      }`}
                      aria-hidden
                    />
                  )}
                </div>
                <div className="mt-2 pb-4 text-center sm:pb-0">
                  <p
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-brand-red' : step.done ? 'text-brand-dark' : 'text-brand-gray'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.date && <p className="mt-0.5 text-[10px] text-brand-gray">{formatOrderDate(step.date)}</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
