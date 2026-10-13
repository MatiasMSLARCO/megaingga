import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ContactSection } from '@/components/sections/ContactSection'

export function ContactPage() {
  useDocumentTitle('Contacto')
  return <ContactSection />
}
