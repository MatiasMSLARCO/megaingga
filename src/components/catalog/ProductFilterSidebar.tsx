import { FileCheck2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DivisionFilter } from '@/components/catalog/ProductFilters'

const DIVISIONS: { value: DivisionFilter; label: string }[] = [
  { value: 'all', label: 'Todos los productos' },
  { value: 'hospitalario', label: 'Acabados Hospitalarios' },
  { value: 'climatizacion', label: 'Climatización HVAC' },
  { value: 'especiales', label: 'Equipos Especiales' },
]

interface ProductFilterSidebarProps {
  active: DivisionFilter
  onChange: (division: DivisionFilter) => void
  divisionCounts: Record<DivisionFilter, number>
  featuredOnly: boolean
  onFeaturedOnlyChange: (value: boolean) => void
  datasheetOnly: boolean
  onDatasheetOnlyChange: (value: boolean) => void
  hasActiveFilters: boolean
  onReset: () => void
}

export function ProductFilterSidebar({
  active,
  onChange,
  divisionCounts,
  featuredOnly,
  onFeaturedOnlyChange,
  datasheetOnly,
  onDatasheetOnlyChange,
  hasActiveFilters,
  onReset,
}: ProductFilterSidebarProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-brand-border/60 bg-white p-4 lg:sticky lg:top-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">Filtros</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-semibold text-brand-red hover:underline cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-gray">División</p>
        <div className="flex flex-col gap-0.5">
          {DIVISIONS.map((division) => {
            const isSelected = active === division.value
            return (
              <button
                key={division.value}
                type="button"
                onClick={() => onChange(division.value)}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg border-l-2 px-2.5 py-2 text-left text-xs font-semibold transition-colors cursor-pointer',
                  isSelected
                    ? 'border-brand-red bg-brand-red/5 text-brand-dark'
                    : 'border-transparent text-brand-gray hover:bg-brand-border-soft/40 hover:text-brand-dark'
                )}
              >
                <span className="line-clamp-1">{division.label}</span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    isSelected ? 'bg-brand-red/15 text-brand-red' : 'bg-black/5 text-brand-gray'
                  )}
                >
                  {divisionCounts[division.value] ?? 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-brand-border-soft pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-gray">Disponibilidad</p>
        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-brand-dark">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => onFeaturedOnlyChange(e.target.checked)}
              className="h-3.5 w-3.5 cursor-pointer accent-brand-red"
            />
            <Sparkles className="h-3.5 w-3.5 text-brand-red" />
            Solo destacados
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-brand-dark">
            <input
              type="checkbox"
              checked={datasheetOnly}
              onChange={(e) => onDatasheetOnlyChange(e.target.checked)}
              className="h-3.5 w-3.5 cursor-pointer accent-brand-red"
            />
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-700" />
            Con ficha técnica
          </label>
        </div>
      </div>
    </div>
  )
}
