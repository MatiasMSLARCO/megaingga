import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { ChevronDown, FileText, Loader2, RefreshCw, Plus, Search, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { ItemsPreviewList } from '@/components/portal/ItemsPreviewList'
import { useCreateQuote, useQuotes } from '@/hooks/useQuotes'
import { useToast } from '@/context/ToastContext'
import { formatOrderDate } from '@/lib/orderStatus'
import { QUOTE_STATUS_BADGE, QUOTE_STATUS_LABELS } from '@/lib/quoteStatus'
import type { PortalQuote } from '@/types/quote.types'

type QuoteFilterTab = 'todas' | 'pendiente' | 'activa' | 'completada'

export function QuotesPage() {
  const { data: quotes = [], isLoading } = useQuotes()
  const createQuote = useCreateQuote()
  const { toast } = useToast()
  const [repeatingId, setRepeatingId] = useState<string | null>(null)
  const [quoteToRepeat, setQuoteToRepeat] = useState<PortalQuote | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<QuoteFilterTab>('todas')

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      if (tab !== 'todas' && q.status !== tab) return false
      if (!search.trim()) return true
      const query = search.toLowerCase()
      const matchId = q.id.toLowerCase().includes(query)
      const matchProject = q.projectName?.toLowerCase().includes(query)
      const matchProduct = q.items.some((i) => i.product.name.toLowerCase().includes(query))
      return matchId || matchProject || matchProduct
    })
  }, [quotes, tab, search])

  const handleConfirmRepeat = () => {
    if (!quoteToRepeat) return
    const targetQuote = quoteToRepeat
    setQuoteToRepeat(null)
    setRepeatingId(targetQuote.id)
    createQuote.mutate(
      { items: targetQuote.items, details: { projectName: targetQuote.projectName } },
      {
        onSuccess: (newQuote) => {
          toast({
            title: 'Cotización repetida',
            description: `Se generó ${newQuote.id} con los mismos productos.`,
            variant: 'success',
          })
        },
        onError: () => {
          toast({
            title: 'No se pudo repetir la cotización',
            description: 'Intenta nuevamente en unos segundos.',
            variant: 'error',
          })
        },
        onSettled: () => setRepeatingId(null),
      }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-brand-dark">Cotizaciones</h1>
          <p className="mt-1 text-sm text-brand-gray">Historial de tus solicitudes de cotización.</p>
        </div>
        <Link to="/portal/cotizaciones/crear">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Crear cotización
          </Button>
        </Link>
      </div>

      {/* Barra de búsqueda y tabs de filtro */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, obra o producto cotizado..."
            className="h-10 w-full rounded-md border border-brand-border bg-white pl-9 pr-8 text-xs text-brand-dark placeholder:text-brand-gray/60 outline-none transition-colors focus:border-brand-red"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-brand-gray hover:text-brand-dark"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-lg border border-brand-border-soft bg-white p-1">
          <button
            type="button"
            onClick={() => setTab('todas')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'todas' ? 'bg-brand-dark text-white' : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            Todas ({quotes.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('activa')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'activa' ? 'bg-brand-dark text-white' : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            Activas ({quotes.filter((q) => q.status === 'activa').length})
          </button>
          <button
            type="button"
            onClick={() => setTab('pendiente')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'pendiente' ? 'bg-brand-dark text-white' : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            Pendientes ({quotes.filter((q) => q.status === 'pendiente').length})
          </button>
          <button
            type="button"
            onClick={() => setTab('completada')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'completada' ? 'bg-brand-dark text-white' : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            Completadas ({quotes.filter((q) => q.status === 'completada').length})
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-brand-border-soft/60" />
          ))}
        </div>
      )}

      {!isLoading && quotes.length > 0 && filteredQuotes.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-8 text-center text-xs text-brand-gray">
          <p className="font-semibold text-brand-dark">No se encontraron cotizaciones</p>
          <p>Prueba con otros términos de búsqueda o cambiando el filtro seleccionado.</p>
          <Button size="sm" variant="outline" onClick={() => { setSearch(''); setTab('todas') }} className="mt-2 text-xs">
            Restablecer filtros
          </Button>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {filteredQuotes.map((quote) => {
          const isExpanded = expandedId === quote.id

          return (
            <Card key={quote.id} className="flex flex-col gap-4 p-5 transition-all hover:border-brand-red/30 hover:shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-border-soft text-brand-dark">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-brand-dark">{quote.id}</p>
                      {quote.projectName && (
                        <span className="rounded-full bg-brand-dark/5 px-2.5 py-0.5 text-[11px] font-semibold text-brand-dark">
                          {quote.projectName}
                        </span>
                      )}
                      <Badge variant={QUOTE_STATUS_BADGE[quote.status]}>{QUOTE_STATUS_LABELS[quote.status]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-brand-gray">
                      {formatOrderDate(quote.createdAt)} · {quote.totalItemsCount} ítems
                      {quote.requiredDate && ` · Requerido para: ${quote.requiredDate}`}
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

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => setQuoteToRepeat(quote)}
                    disabled={repeatingId === quote.id}
                  >
                    {repeatingId === quote.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    {repeatingId === quote.id ? 'Repitiendo...' : 'Repetir compra'}
                  </Button>
                </div>
              </div>

              {isExpanded && <ItemsPreviewList items={quote.items} />}
            </Card>
          )
        })}
      </div>

      {/* Modal de confirmación para repetir cotización */}
      {quoteToRepeat && (
        <ConfirmationModal
          isOpen={Boolean(quoteToRepeat)}
          onClose={() => setQuoteToRepeat(null)}
          onConfirm={handleConfirmRepeat}
          title="¿Repetir cotización?"
          description={`Se generará una nueva solicitud duplicada con los ${quoteToRepeat.totalItemsCount} productos de la cotización ${quoteToRepeat.id}${quoteToRepeat.projectName ? ` para el proyecto "${quoteToRepeat.projectName}"` : ''}.`}
          confirmText="Sí, duplicar cotización"
          cancelText="Cancelar"
          variant="brand"
        />
      )}
    </div>
  )
}
