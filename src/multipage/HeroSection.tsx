import { Link } from 'react-router'
import { ChevronRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface HeroSectionProps {
  onOpenQuote: () => void
}

export function HeroSection({ onOpenQuote }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative flex min-h-[100dvh] items-center overflow-hidden bg-brand-dark text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        src="/assets/video/hero-video.mp4"
        poster="/assets/images/hero/hero-planta-industrial.webp"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/40" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-24 sm:px-6 lg:px-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
          Ingeniería y Construcción · Ecuador
        </span>

        <h1 className="max-w-4xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-5xl xl:text-6xl">
          Diseñamos y construimos tu clínica y hospital
        </h1>

        <p className="max-w-2xl text-base font-semibold uppercase tracking-wide text-white/70 sm:text-lg">
          Especialistas en remodelación y construcción de clínicas y hospitales
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button size="lg" onClick={onOpenQuote}>
            <FileText className="h-5 w-5" />
            Solicitar Cotización
          </Button>
          <Link
            to="/servicios"
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-white/80 transition-colors hover:text-brand-red"
          >
            Ver catálogo técnico
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
