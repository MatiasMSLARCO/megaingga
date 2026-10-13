import { useOutletContext } from 'react-router'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { HeroSection } from '../HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ClientsSection } from '@/components/sections/ClientsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import type { AppOutletContext } from '@/types/outlet-context.types'

export function HomePage() {
  useDocumentTitle()
  const { openQuote } = useOutletContext<AppOutletContext>()

  return (
    <>
      <HeroSection onOpenQuote={openQuote} />
      <AboutSection />
      <ClientsSection />
      <ContactSection />
    </>
  )
}
