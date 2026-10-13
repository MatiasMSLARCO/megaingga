import { Link, useParams } from 'react-router'
import { ChevronLeft, FolderSearch, MapPin } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useProjectBySlug } from '@/hooks/useProjects'
import { Badge } from '@/components/ui/Badge'
import type { ProjectDivision } from '@/types/project.types'

const DIVISION_LABEL: Record<ProjectDivision, string> = {
  hospitalario: 'Hospitalario',
  civil: 'Civil',
  mecanico: 'Mecánico',
  electrico: 'Eléctrico',
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading } = useProjectBySlug(slug)

  useDocumentTitle(project?.title)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="aspect-[16/9] animate-pulse rounded-lg bg-brand-border-soft" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-8">
        <FolderSearch className="h-10 w-10 text-brand-gray/40" />
        <p className="text-lg font-bold text-brand-dark">Proyecto no encontrado</p>
        <p className="text-sm text-brand-gray">El proyecto que buscas no existe o ya no está disponible.</p>
        <Link to="/proyectos" className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-red hover:underline">
          Volver al portafolio
        </Link>
      </div>
    )
  }

  const galleryImages = [project.mainImageUrl, ...project.galleryImages.filter((img) => img !== project.mainImageUrl)]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        to="/proyectos"
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gray hover:text-brand-red"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver al portafolio
      </Link>

      <div className="aspect-[16/9] overflow-hidden rounded-lg bg-brand-border-soft">
        <img src={project.mainImageUrl} alt={project.title} className="h-full w-full object-cover" />
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-3 flex gap-3">
          {galleryImages.slice(1).map((src) => (
            <div key={src} className="h-20 w-28 overflow-hidden rounded-md bg-brand-border-soft">
              <img src={src} alt={project.title} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Badge variant={project.featured ? 'red' : 'dark'}>{DIVISION_LABEL[project.division]}</Badge>
        {project.featured && <Badge variant="outline">Caso destacado</Badge>}
      </div>

      <h1 className="mt-3 text-2xl font-extrabold uppercase tracking-tight text-brand-dark sm:text-3xl">
        {project.title}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-brand-gray">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0" />
          {project.location}
        </span>
        <span>
          Cliente: <span className="font-semibold text-brand-dark">{project.clientName}</span>
        </span>
        <span>Año: <span className="font-semibold text-brand-dark">{project.year}</span></span>
      </div>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-brand-gray">{project.description}</p>

      {project.scopeGroups ? (
        <div className="mt-6 flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-brand-dark">Alcance del Proyecto</h2>
          {project.scopeGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-brand-red">{group.title}</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-brand-border-soft bg-white px-3 py-2 text-sm text-brand-dark"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wide text-brand-dark">Alcance del Proyecto</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {project.scope.map((item) => (
              <li
                key={item}
                className="rounded-md border border-brand-border-soft bg-white px-3 py-2 text-sm text-brand-dark"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
