import { useState } from 'react'
import { ArrowRight, ChevronDown, FileText, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ItemsPreviewList } from '@/components/portal/ItemsPreviewList'
import { useQuotes, useUpdateQuoteStatus } from '@/hooks/useQuotes'
import { useToast } from '@/context/ToastContext'
import { formatOrderDate } from '@/lib/orderStatus'
import { QUOTE_STATUS_BADGE, QUOTE_STATUS_LABELS, getNextQuoteStatus } from '@/lib/quoteStatus'

export function BackofficeQuotesPage() {
  const { data: quotes = [], isLoading } = useQuotes()
  const updateStatus = useUpdateQuoteStatus()
  const { toast } = useToast()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleAdvance = (quoteId: string) => {
    const quote = quotes.find((q) => q.id === quoteId)
    const next = quote ? getNextQuoteStatus(quote.status) : null
    if (!next) return

    setUpdatingId(quoteId)
    updateStatus.mutate(
      { id: quoteId, status: next },
      {
        onSuccess: () => {
          toast({
            title: 'Cotización actualizada',
            description: `${quoteId} ahora está "${QUOTE_STATUS_LABELS[next]}".`,
            variant: 'success',
          })
        },
        onError: () => {
          toast({ title: 'No se pudo actualizar la cotización', variant: 'error' })
        },
        onSettled: () => setUpdatingId(null),
      }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark">Cotizaciones</h1>
        <p className="mt-1 text-sm text-brand-gray">Revisa y avanza el estado de las solicitudes de cotización.</p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-brand-border-soft/60" />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {quotes.map((quote) => {
          const isExpanded = expandedId === quote.id
          const next = getNextQuoteStatus(quote.status)
          const isUpdating = updatingId === quote.id

          return (
            <Card key={quote.id} className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-border-soft text-brand-dark">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-brand-dark">{quote.id}</p>
                      <Badge variant={QUOTE_STATUS_BADGE[quote.status]}>{QUOTE_STATUS_LABELS[quote.status]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-brand-gray">
                      {formatOrderDate(quote.createdAt)} · {quote.totalItemsCount} ítems
                    </p>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline cursor-pointer"
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      {isExpanded ? 'Ocultar productos' : `Ver productos (${quote.items.length})`}
                    </button>
                  </div>
                </div>

                {next ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 gap-1.5"
                    onClick={() => handleAdvance(quote.id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                    {isUpdating ? 'Actualizando...' : `Marcar como ${QUOTE_STATUS_LABELS[next]}`}
                  </Button>
                ) : (
                  <Badge variant="default" className="shrink-0">
                    Completada
                  </Badge>
                )}
              </div>

              {isExpanded && <ItemsPreviewList items={quote.items} />}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
