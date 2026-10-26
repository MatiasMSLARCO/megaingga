import { useEffect } from 'react'
import { useOutletContext } from 'react-router'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { useHeroMode } from '@/hooks/useHeroMode'
import { BlueprintHero } from '@/components/sections/BlueprintHero'
import { CommercialHero } from '@/components/sections/CommercialHero'
import { AboutSection } from '@/components/sections/AboutSection'
import { ServicesTeaser } from '@/components/sections/ServicesTeaser'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ClientsSection } from '@/components/sections/ClientsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import type { AppOutletContext } from '@/types/outlet-context.types'

export function LandingPage() {
  const { addToQuote, openQuote } = useOutletContext<AppOutletContext>()
  const { heroMode, setHeroMode } = useHeroMode()

  // Recalibrar GSAP ScrollTrigger al cambiar entre el 3D Blueprint (420vh) y el hero comercial (100dvh)
  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.refresh()
      window.dispatchEvent(new Event('scroll'))
    }

    const rafId = requestAnimationFrame(handleRefresh)
    const timer = setTimeout(handleRefresh, 100)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timer)
    }
  }, [heroMode])

  return (
    <>
      {heroMode === 'blueprint' ? (
        <BlueprintHero onOpenQuote={openQuote} />
      ) : (
        <CommercialHero onOpenQuote={openQuote} />
      )}

      {/* Selector de portada inferior derecho sobrio y sin emojis */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center rounded-md border border-neutral-700 bg-brand-dark/95 p-1 shadow-2xl backdrop-blur-md">
        <span className="px-2.5 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          Portada:
        </span>
        <button
          type="button"
          onClick={() => setHeroMode('blueprint')}
          className={cn(
            'rounded px-3 py-1.5 font-mono text-xs font-semibold transition-colors cursor-pointer',
            heroMode === 'blueprint'
              ? 'bg-brand-red text-white'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          3D Blueprint
        </button>
        <button
          type="button"
          onClick={() => setHeroMode('commercial')}
          className={cn(
            'rounded px-3 py-1.5 font-mono text-xs font-semibold transition-colors cursor-pointer',
            heroMode === 'commercial'
              ? 'bg-brand-red text-white'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          Insumos B2B
        </button>
      </div>

      <AboutSection />
      <ServicesTeaser onAddToQuote={addToQuote} />
      <ProjectsSection />
      <ClientsSection />
      <ContactSection />
    </>
  )
}
