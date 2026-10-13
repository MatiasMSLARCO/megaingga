import { useOutletContext } from 'react-router'
import { BlueprintHero } from '@/components/sections/BlueprintHero'
import { AboutSection } from '@/components/sections/AboutSection'
import { ServicesTeaser } from '@/components/sections/ServicesTeaser'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ClientsSection } from '@/components/sections/ClientsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import type { AppOutletContext } from '@/types/outlet-context.types'

export function LandingPage() {
  const { addToQuote, onBuyNow, openQuote } = useOutletContext<AppOutletContext>()

  return (
    <>
      <BlueprintHero onOpenQuote={openQuote} />
      <AboutSection />
      <ServicesTeaser onAddToQuote={addToQuote} onBuyNow={onBuyNow} />
      <ProjectsSection />
      <ClientsSection />
      <ContactSection />
    </>
  )
}
