import { Link } from 'react-router'
import { ArrowRight, LogIn } from 'lucide-react'

// Design Read:
// Serious B2B Industrial & Hospital Engineering procurement landing for technical buyers,
// with an authentic industrial editorial language, dark raw-steel neutrals, zero AI slop,
// strict typographic discipline, and direct portal authentication.
// Dials: VARIANCE: 6 | MOTION: 4 | DENSITY: 4

interface CommercialHeroProps {
  onOpenQuote?: () => void
}

export function CommercialHero(_props: CommercialHeroProps = {}) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-brand-dark pt-20 pb-12 text-white"
    >
      {/* Video de fondo industrial con poster fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/images/hero/hero-planta-industrial.webp"
          className="h-full w-full object-cover object-center brightness-[0.72] contrast-[1.08]"
        >
          <source src="/assets/video/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradiente sobrio de alto contraste para máxima legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-black/40" />
      </div>

      {/* Contenido Principal enfocado en venta de insumos y acceso a portal */}
      <div className="relative z-10 mx-auto my-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Eyebrow técnico sin puntos decorativos ni artificios */}
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
            Megaingga · Suministro Industrial & Hospitalario
          </p>

          {/* Titular sobrio y contundente (máximo 2 líneas en desktop) */}
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Suministro técnico certificado para{' '}
            <span className="italic text-brand-red">obras de ingeniería</span>.
          </h1>

          {/* Subtítulo exacto (16 palabras, dentro del límite de 20 palabras) */}
          <p className="mt-5 max-w-xl text-base text-white/80 leading-relaxed sm:text-lg">
            Equipamiento crítico para plantas industriales y hospitales en Ecuador, con entrega directa en obra y trazabilidad.
          </p>

          {/* Acciones principales (máximo 2 CTAs, sin duplicación de intención) */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/ingresar"
              className="inline-flex h-12 items-center gap-2.5 rounded-md bg-brand-red px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-red/90 active:scale-98"
            >
              <LogIn className="h-4 w-4" />
              Acceder al Portal de Clientes
            </Link>

            <a
              href="#suministros"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/30 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:border-white hover:bg-white/15"
            >
              Ver Insumos Destacados
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Franja de pie sobria y funcional con datos clave reales */}
      <div className="relative z-10 mx-auto w-full max-w-7xl border-t border-white/15 pt-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs text-white/70 font-mono">
          <div>Normas INEN, NFPA y ASME</div>
          <div>Despacho nacional desde bodega central</div>
          <div>Cotizaciones B2B en portal privado</div>
        </div>
      </div>

      {/* Sentinel para cálculo de scroll en navbar */}
      <div id="nav-hero-sentinel" className="absolute bottom-0 h-px w-full" />
    </section>
  )
}
