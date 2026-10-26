import { useState } from 'react'
import { Activity, ChevronDown, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatOrderDateTime, formatRelativeDate } from '@/lib/orderStatus'
import type { OrderNovedad } from '@/types/order.types'

interface OrderActivityFeedProps {
  novedades: OrderNovedad[]
}

export function OrderActivityFeed({ novedades }: OrderActivityFeedProps) {
  const [showAll, setShowAll] = useState(false)

  if (novedades.length === 0) return null

  const displayedNovedades = showAll ? novedades : novedades.slice(0, 4)
  const hasMore = novedades.length > 4

  return (
    <Card className="p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-brand-border-soft pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4.5 w-4.5 text-brand-red" />
          <h2 className="text-xs font-bold uppercase tracking-wide text-brand-dark">
            Bitácora de Hitos y Trazabilidad en Ruta
          </h2>
        </div>
        <span className="rounded-full bg-brand-dark/5 px-2.5 py-0.5 text-[11px] font-semibold text-brand-gray">
          {novedades.length} hitos registrados
        </span>
      </div>

      <ul className="flex flex-col gap-0 pt-1">
        {displayedNovedades.map((novedad, i) => {
          const isLatest = i === 0

          return (
            <li key={i} className="relative flex gap-3.5 pb-4 last:pb-1">
              {/* Connector and bullet */}
              <div className="flex flex-col items-center">
                {isLatest ? (
                  <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-red shadow-xs" />
                  </span>
                ) : (
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-border" />
                )}
                {i < displayedNovedades.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-brand-border-soft" />
                )}
              </div>

              {/* Milestone Details */}
              <div className="flex-1 min-w-0 pb-0.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <p className={`text-xs ${isLatest ? 'font-bold text-brand-dark' : 'font-medium text-brand-dark/85'}`}>
                    {novedad.text}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-brand-gray">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-brand-gray/70" />
                    {formatOrderDateTime(novedad.date)}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-brand-red/90">
                    {formatRelativeDate(novedad.date)}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <div className="mt-2 border-t border-brand-border-soft pt-3 text-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline cursor-pointer"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            {showAll ? 'Mostrar menos hitos' : `Ver los ${novedades.length} hitos de la ruta`}
          </button>
        </div>
      )}
    </Card>
  )
}
