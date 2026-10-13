import { useState, useRef } from 'react'
import {
  PackageSearch,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Truck,
  ChevronRight,
  Building2,
  Wind,
  MessageCircle,
} from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ProductFilters, type DivisionFilter } from '@/components/catalog/ProductFilters'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductDetailModal } from '@/components/catalog/ProductDetailModal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'
import { companyInfo } from '@/data/company.data'
import type { Product } from '@/types/product.types'

interface ServicesSectionProps {
  onAddToQuote: (product: Product, quantity?: number) => void
  onBuyNow: (product: Product, quantity: number) => void
}

const CATEGORY_TILES = [
  {
    division: 'hospitalario' as const,
    title: 'Quirófanos',
    subtitle: 'Asepsia y Acero 304',
    count: '5 soluciones',
    image: '/assets/images/projects/proyecto-electrico-tableros-potencia.webp',
  },
  {
    division: 'hospitalario' as const,
    title: 'Pisos Vinílicos',
    subtitle: 'Conductivos y Alto Tráfico',
    count: '3 modelos',
    image: '/assets/images/products/piso-vinilico-conductivo.webp',
  },
  {
    division: 'hospitalario' as const,
    title: 'Blindaje Radiológico',
    subtitle: 'Salas de Rayos X y Resonancia',
    count: '2 sistemas',
    image: '/assets/images/products/acabados-quirofano-modular.webp',
  },
  {
    division: 'climatizacion' as const,
    title: 'Manejadoras AHU',
    subtitle: 'Filtración HEPA y Presión',
    count: '4 equipos',
    image: '/assets/images/products/unidad-manejadora-aire-ahu.webp',
  },
  {
    division: 'climatizacion' as const,
    title: 'Rooftops y Clima',
    subtitle: 'Equipos Paquete Industrial',
    count: '3 equipos',
    image: '/assets/images/projects/proyecto-mecanico-redes-contraincendio.webp',
  },
  {
    division: 'especiales' as const,
    title: 'Calderos y Vapor',
    subtitle: 'Generación y Vapor Hospitalario',
    count: '4 sistemas',
    image: '/assets/images/projects/proyecto-civil-estructuras-metalicas.webp',
  },
]

export function ServicesSection({ onAddToQuote, onBuyNow }: ServicesSectionProps) {
  const [division, setDivision] = useState<DivisionFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const catalogAnchorRef = useRef<HTMLDivElement>(null)

  const { data: allProducts, isLoading } = useProducts()
  const { data: filteredProducts } = useProducts({
    division: division === 'all' ? undefined : division,
    search,
  })

  const handleSelectCategoryTile = (div: DivisionFilter) => {
    setDivision(div)
    setSearch('')
    if (catalogAnchorRef.current) {
      catalogAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleReset = () => {
    setDivision('all')
    setSearch('')
  }

  const scrollToCatalog = () => {
    if (catalogAnchorRef.current) {
      catalogAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const ref = useScrollReveal<HTMLElement>({ stagger: 0.05, deps: [allProducts, isLoading] })

  // 4 Featured products with authentic imagery
  const featuredProducts =
    allProducts?.filter((p) =>
      ['prod-04', 'prod-02', 'prod-09', 'prod-12'].includes(p.id)
    ) ?? []

  // 3 Hospitalario spotlight items
  const hospitalSpotlight =
    allProducts?.filter((p) =>
      ['prod-04', 'prod-02', 'prod-03'].includes(p.id)
    ) ?? []

  // 3 HVAC spotlight items
  const hvacSpotlight =
    allProducts?.filter((p) =>
      ['prod-07', 'prod-06', 'prod-09'].includes(p.id)
    ) ?? []

  return (
    <section ref={ref} id="tienda" className="blueprint-grid bg-[#FAF9F6] py-24 text-brand-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ========================================================= */}
        {/* 1. CABECERA TÉCNICA PRINCIPAL                             */}
        {/* ========================================================= */}
        <div data-reveal className="mb-14">
          <SectionHeading
            eyebrow="Tienda Técnica"
            title={
              <>
                Catálogo técnico de <span className="italic text-brand-red">soluciones</span>.
              </>
            }
            subtitle="Equipamiento certificado para hospitales, clínicas e industrias en Ecuador, con asesoría directa de ingenieros y fichas técnicas descargables."
          />
        </div>

        {/* ========================================================= */}
        {/* 2. EXPLORAR POR ESPECIALIDAD (6 TILES)                    */}
        {/* ========================================================= */}
        <div data-reveal className="mb-20">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-dark">
              Líneas de Suministro
            </h3>
            {division !== 'all' && (
              <button
                type="button"
                onClick={() => setDivision('all')}
                className="text-xs font-bold uppercase tracking-wider text-brand-red hover:underline cursor-pointer"
              >
                Ver todo el catálogo →
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
            {CATEGORY_TILES.map((tile, idx) => {
              const isSelected = division === tile.division
              return (
                <button
                  key={`${tile.title}-${idx}`}
                  type="button"
                  onClick={() => handleSelectCategoryTile(tile.division)}
                  className={cn(
                    'group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl p-4 text-left shadow-xs transition-all duration-200 cursor-pointer',
                    'hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10',
                    isSelected ? 'ring-2 ring-brand-red ring-offset-2' : 'border border-black/5'
                  )}
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="relative z-10 flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                      {tile.count}
                    </span>
                    <span className="text-base font-bold text-white leading-snug">
                      {tile.title}
                    </span>
                    <span className="text-[11px] text-white/75 line-clamp-1">
                      {tile.subtitle}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. EQUIPAMIENTO DESTACADO                                 */}
        {/* ========================================================= */}
        {featuredProducts.length > 0 && (
          <div data-reveal className="mb-24">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-dark">
                  Equipamiento Destacado
                </h3>
                <p className="mt-1 text-xs text-brand-gray">
                  Soluciones críticas con fichas técnicas y entrega programada en obra.
                </p>
              </div>
              <button
                type="button"
                onClick={scrollToCatalog}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline cursor-pointer"
              >
                <span>Ver catálogo completo (14)</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`featured-${product.id}`}
                  product={product}
                  onViewDetail={setSelectedProduct}
                  onAddToQuote={(p) => onAddToQuote(p)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/20 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark cursor-pointer"
              >
                <span>Ver catálogo completo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* 4. SPLIT BANNERS DE ALTA CAPACIDAD TÉCNICA                */}
      {/* ========================================================= */}
      <div data-reveal className="mb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Banner 1: Hospitalario */}
          <div
            onClick={() => handleSelectCategoryTile('hospitalario')}
            className="group relative flex min-h-[400px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-8 text-white shadow-md transition-all duration-200 sm:p-10 hover:-translate-y-1"
          >
            <img
              src="/assets/images/projects/proyecto-electrico-tableros-potencia.webp"
              alt="Infraestructura Hospitalaria y Quirófanos"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />

            <div className="relative z-10 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-red text-white">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                División Hospitalaria
              </span>
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              <h3 className="text-2xl font-bold sm:text-3xl leading-snug">
                Quirófanos y Áreas Estériles
              </h3>
              <p className="max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
                Suministro certificado de puertas herméticas en acero AISI 304, blindaje plomado para imagenología y pisos vinílicos disipadores de estática.
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark transition-colors group-hover:bg-brand-red group-hover:text-white">
                  Explorar división hospitalaria
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Banner 2: Climatización HVAC */}
          <div
            onClick={() => handleSelectCategoryTile('climatizacion')}
            className="group relative flex min-h-[400px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-8 text-white shadow-md transition-all duration-200 sm:p-10 hover:-translate-y-1"
          >
            <img
              src="/assets/images/projects/proyecto-mecanico-redes-contraincendio.webp"
              alt="Climatización HVAC Industrial"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />

            <div className="relative z-10 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-red text-white">
                <Wind className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                División Climatización HVAC
              </span>
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              <h3 className="text-2xl font-bold sm:text-3xl leading-snug">
                Sistemas HVAC y Calidad de Aire
              </h3>
              <p className="max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
                Unidades manejadoras de aire (AHU), filtración de alta eficiencia y ventilación mecánica con renovación para salas limpias e industria.
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark transition-colors group-hover:bg-brand-red group-hover:text-white">
                  Explorar equipos HVAC
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* 5. SPOTLIGHT 1: HOSPITALARIO (HERO + 3 PRODUCTOS)         */}
        {/* ========================================================= */}
        {hospitalSpotlight.length > 0 && (
          <div data-reveal className="mb-20">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-dark">
                Acabados para Áreas Críticas
              </h3>
              <button
                type="button"
                onClick={() => handleSelectCategoryTile('hospitalario')}
                className="text-xs font-bold uppercase tracking-wider text-brand-red hover:underline cursor-pointer"
              >
                Ver todos los hospitalarios →
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
              {/* Hero Card (4 cols) */}
              <div
                onClick={() => handleSelectCategoryTile('hospitalario')}
                className="group relative col-span-12 flex min-h-[380px] flex-col justify-between overflow-hidden rounded-xl bg-brand-dark p-7 text-white shadow-md transition-all duration-200 lg:col-span-4 cursor-pointer"
              >
                <img
                  src="/assets/images/projects/proyecto-remodelacion-medica-siemens.webp"
                  alt="Instalaciones hospitalarias"
                  className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent" />

                <div className="relative z-10 flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-red">
                    Estándar Clínico
                  </span>
                  <h4 className="font-serif text-2xl font-semibold leading-tight">
                    Materiales Quirúrgicos Certificados
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">
                    Suministro técnico para construcción o remodelación de centros hospitalarios con máxima bioseguridad.
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Acero inoxidable AISI 304 de alta asepsia
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Pisos conductivos disipadores de estática
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Blindaje plomado contra radiaciones
                  </div>

                  <span className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark transition-colors group-hover:bg-brand-red group-hover:text-white">
                    Ver división hospitalaria
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* 3 Cards (8 cols) */}
              <div className="col-span-12 grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
                {hospitalSpotlight.map((product) => (
                  <ProductCard
                    key={`hosp-${product.id}`}
                    product={product}
                    onViewDetail={setSelectedProduct}
                    onAddToQuote={(p) => onAddToQuote(p)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. SPOTLIGHT 2: HVAC & CLIMA (HERO + 3 PRODUCTOS)         */}
        {/* ========================================================= */}
        {hvacSpotlight.length > 0 && (
          <div data-reveal className="mb-24">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-dark">
                Equipos de Climatización Industrial
              </h3>
              <button
                type="button"
                onClick={() => handleSelectCategoryTile('climatizacion')}
                className="text-xs font-bold uppercase tracking-wider text-brand-red hover:underline cursor-pointer"
              >
                Ver todos los equipos HVAC →
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
              {/* Hero Card (4 cols) */}
              <div
                onClick={() => handleSelectCategoryTile('climatizacion')}
                className="group relative col-span-12 flex min-h-[380px] flex-col justify-between overflow-hidden rounded-xl bg-[#141B24] p-7 text-white shadow-md transition-all duration-200 lg:col-span-4 cursor-pointer"
              >
                <img
                  src="/assets/images/products/equipo-climatizacion-rooftop.webp"
                  alt="Equipos de climatización"
                  className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141B24] via-[#141B24]/80 to-transparent" />

                <div className="relative z-10 flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brand-red">
                    Ingeniería de Fluidos
                  </span>
                  <h4 className="font-serif text-2xl font-semibold leading-tight">
                    Tratamiento y Calidad de Aire Crítico
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">
                    Unidades manejadoras de aire, filtración de alta eficiencia y control térmico continuo para procesos exigentes.
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Presiones diferenciales en salas limpias
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Etapas de filtración y renovación continua
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Equipos rooftop y unidades paquete
                  </div>

                  <span className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark transition-colors group-hover:bg-brand-red group-hover:text-white">
                    Ver división HVAC
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* 3 Cards (8 cols) */}
              <div className="col-span-12 grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
                {hvacSpotlight.map((product) => (
                  <ProductCard
                    key={`hvac-${product.id}`}
                    product={product}
                    onViewDetail={setSelectedProduct}
                    onAddToQuote={(p) => onAddToQuote(p)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. MANIFIESTO DE CAPACIDAD TÉCNICA (ANTI-SLOP)            */}
        {/* ========================================================= */}
        <div data-reveal className="mb-24">
          <div className="blueprint-grid-dark overflow-hidden rounded-lg bg-brand-ink p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#e6e1d4]/60">
                  <span className="h-px w-8 bg-brand-red" />
                  <span>Compromiso de Ingeniería</span>
                </div>
                <h3 className="mt-4 font-serif text-2xl font-semibold leading-snug text-[#f4efe2] sm:text-3xl">
                  Diseñamos, suministramos y construimos infraestructura técnica para las instituciones médicas e
                  industriales más exigentes del Ecuador.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#e6e1d4]/70">
                  Más de una década ejecutando proyectos hospitalarios, mecánicos y eléctricos cumpliendo normativas
                  sanitarias nacionales e internacionales.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={`https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent('Hola MEGA INGENIERÍA, deseo solicitar asesoría técnica para un proyecto.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-red/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Solicitar Asesoría</span>
                </a>
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#f4efe2] transition-colors hover:bg-white/5 cursor-pointer"
                >
                  <span>Ver Catálogo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 8. EXPLORADOR COMPLETO Y FILTRADO                         */}
        {/* ========================================================= */}
        <div ref={catalogAnchorRef} id="explorar-catalogo" className="pt-8">
          <div data-reveal className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-dark">
                {division === 'all'
                  ? 'Catálogo Completo de Productos'
                  : CATEGORY_TILES.find((t) => t.division === division)?.title ?? 'Catálogo de Productos'}
              </h3>
              <p className="text-xs text-brand-gray mt-1">
                Filtra por división o busca directamente por especificación técnica.
              </p>
            </div>
            <p className="text-xs font-semibold text-brand-gray">
              {filteredProducts ? `${filteredProducts.length} productos disponibles` : 'Cargando...'}
            </p>
          </div>

          <div data-reveal className="mb-8">
            <ProductFilters
              active={division}
              onChange={setDivision}
              search={search}
              onSearchChange={setSearch}
              totalCount={filteredProducts?.length}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="h-80 animate-pulse rounded-xl bg-brand-border-soft" />
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div key={product.id} data-reveal>
                  <ProductCard
                    product={product}
                    onViewDetail={setSelectedProduct}
                    onAddToQuote={(p) => onAddToQuote(p)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-brand-border bg-white py-16 text-center shadow-xs">
              <PackageSearch className="h-10 w-10 text-brand-gray/40" />
              <p className="text-sm font-bold text-brand-dark">No se encontraron productos coincidentes</p>
              <p className="max-w-xs text-xs text-brand-gray">
                Intenta con otra palabra clave o restablece los filtros.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 rounded-lg bg-brand-dark px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-red cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 9. PILARES DE CONFIANZA TÉCNICA                           */}
        {/* ========================================================= */}
        <div data-reveal className="mt-24 grid gap-px overflow-hidden rounded-lg border border-[#EAE8E3] bg-[#EAE8E3] sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'Normativa Sanitaria',
              body: 'Materiales de grado quirúrgico, blindaje radiológico y sistemas orientados a la bioseguridad según normativas aplicables.',
            },
            {
              icon: Wrench,
              title: 'Ingeniería Especializada',
              body: 'Dimensionamiento y acompañamiento en planos por profesionales civiles, mecánicos y eléctricos en cada cotización.',
            },
            {
              icon: Truck,
              title: 'Cobertura en Ecuador',
              body: 'Logística, despacho y capacidad de montaje en sitio en Quito, Guayaquil, Cuenca y a nivel nacional.',
            },
          ].map((pillar) => {
            const Icon = pillar.icon
            return (
              <div key={pillar.title} className="bg-[#FAF9F6] p-7">
                <Icon className="h-6 w-6 text-brand-dark" strokeWidth={1.5} />
                <h4 className="mt-5 font-serif text-xl font-semibold text-brand-dark">{pillar.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-brand-gray">{pillar.body}</p>
              </div>
            )
          })}
        </div>

      </div>

      {/* Modal de Detalle de Producto */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={(product, quantity) => onAddToQuote(product, quantity)}
        onBuyNow={(product, quantity) => {
          setSelectedProduct(null)
          onBuyNow(product, quantity)
        }}
      />
    </section>
  )
}
