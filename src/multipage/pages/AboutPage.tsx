import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AboutSection } from '@/components/sections/AboutSection'

export function AboutPage() {
  useDocumentTitle('Nosotros')
  return <AboutSection />
}
