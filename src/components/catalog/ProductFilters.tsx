import { Search, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductDivision } from '@/types/product.types'

export type DivisionFilter = ProductDivision | 'all'

const DIVISIONS: { value: DivisionFilter; label: string }[] = [
  { value: 'all', label: 'Todos los Productos' },
  { value: 'hospitalario', label: 'Acabados Hospitalarios' },
  { value: 'climatizacion', label: 'Climatización HVAC' },
  { value: 'especiales', label: 'Equipos Especiales' },
]

interface ProductFiltersProps {
  active: DivisionFilter
  onChange: (division: DivisionFilter) => void
  search: string
  onSearchChange: (value: string) => void
  totalCount?: number
}

export function ProductFilters({ active, onChange, search, onSearchChange, totalCount }: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-brand-border/60 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="hidden items-center gap-1.5 pl-1 pr-2 text-xs font-bold uppercase tracking-wider text-brand-gray lg:inline-flex">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtrar:
        </span>
        {DIVISIONS.map((division) => {
          const isSelected = active === division.value
          return (
            <button
              key={division.value}
              type="button"
              onClick={() => onChange(division.value)}
              className={cn(
                'rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'bg-brand-dark text-white shadow-md shadow-brand-dark/15'
                  : 'bg-brand-border-soft/40 text-brand-dark/70 hover:bg-brand-border-soft hover:text-brand-dark'
              )}
            >
              {division.label}
              {division.value === 'all' && totalCount !== undefined && (
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-brand-gray'
                  )}
                >
                  {totalCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar producto o norma..."
          className="h-10 w-full rounded-xl border border-brand-border/80 bg-brand-border-soft/20 pl-10 pr-9 text-xs font-medium text-brand-dark placeholder:text-brand-gray/60 outline-none transition-all focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/10"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-dark cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
