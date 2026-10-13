import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductDivision } from '@/types/product.types'

export type DivisionFilter = ProductDivision | 'all'

const DIVISIONS: { value: DivisionFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'hospitalario', label: 'Acabados Hospitalarios' },
  { value: 'climatizacion', label: 'Climatización HVAC' },
  { value: 'especiales', label: 'Equipos Especiales' },
]

interface ProductFiltersProps {
  active: DivisionFilter
  onChange: (division: DivisionFilter) => void
  search: string
  onSearchChange: (value: string) => void
}

export function ProductFilters({ active, onChange, search, onSearchChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {DIVISIONS.map((division) => (
          <button
            key={division.value}
            type="button"
            onClick={() => onChange(division.value)}
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors cursor-pointer',
              active === division.value
                ? 'border-brand-red bg-brand-red text-white'
                : 'border-brand-border text-brand-gray hover:border-brand-red hover:text-brand-red'
            )}
          >
            {division.label}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar producto..."
          className="h-10 w-full rounded-md border border-brand-border bg-white pl-9 pr-3 text-sm text-brand-dark placeholder:text-brand-gray/60 outline-none transition-colors focus:border-brand-red"
        />
      </div>
    </div>
  )
}
