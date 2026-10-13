import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ProjectsSection } from '../ProjectsSection'

export function ProjectsPage() {
  useDocumentTitle('Proyectos')
  return <ProjectsSection />
}
