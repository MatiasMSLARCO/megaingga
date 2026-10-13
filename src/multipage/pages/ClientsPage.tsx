import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ClientsSection } from '@/components/sections/ClientsSection'

export function ClientsPage() {
  useDocumentTitle('Clientes')
  return <ClientsSection />
}
