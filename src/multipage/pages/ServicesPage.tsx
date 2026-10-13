import { useOutletContext } from 'react-router'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ServicesSection } from '../ServicesSection'
import type { AppOutletContext } from '@/types/outlet-context.types'

export function ServicesPage() {
  useDocumentTitle('Catálogo Técnico')
  const { addToQuote } = useOutletContext<AppOutletContext>()
  return <ServicesSection onAddToQuote={addToQuote} />
}
