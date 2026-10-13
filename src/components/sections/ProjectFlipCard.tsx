import { MapPin, RotateCw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { Project, ProjectDivision } from '@/types/project.types'

const DIVISION_LABEL: Record<ProjectDivision, string> = {
  hospitalario: 'Hospitalario',
  civil: 'Civil',
  mecanico: 'Mecánico',
  electrico: 'Eléctrico',
}

interface ProjectFlipCardProps {
  project: Project
  isFlipped: boolean
  onToggle: () => void
}

export function ProjectFlipCard({ project, isFlipped, onToggle }: ProjectFlipCardProps) {
  const reduceMotion = usePrefersReducedMotion()

  if (reduceMotion) {
    return (
      <div className="flex h-[28rem] flex-col overflow-hidden rounded-lg border border-brand-border-soft bg-white">
        <button type="button" onClick={onToggle} className="relative block h-full w-full cursor-pointer text-left">
          {!isFlipped ? (
            <ProjectCardFront project={project} />
          ) : (
            <div className="h-full overflow-y-auto">
              <ProjectCardBack project={project} />
            </div>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="h-[28rem] [perspective:1600px]">
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
        aria-pressed={isFlipped}
        className={cn(
          'relative h-full w-full cursor-pointer rounded-lg [transform-style:preserve-3d] transition-transform duration-[550ms]',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-lg border border-brand-border-soft bg-white [backface-visibility:hidden]">
          <ProjectCardFront project={project} />
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-lg border border-brand-border-soft bg-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full overflow-y-auto">
            <ProjectCardBack project={project} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCardFront({ project }: { project: Project }) {
  return (
    <div className="relative h-full w-full">
      <img src={project.mainImageUrl} alt={project.title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />

      <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        <Badge variant={project.featured ? 'red' : 'dark'}>{DIVISION_LABEL[project.division]}</Badge>
        {project.featured && (
          <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
            Caso destacado
          </Badge>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div>
          <h3 className="text-lg font-bold leading-tight text-white">{project.title}</h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {project.location}
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 py-2 pl-3 pr-3.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          <RotateCw className="h-3.5 w-3.5" />
          Ver detalle
        </span>
      </div>
    </div>
  )
}

function ProjectCardBack({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-brand-dark">{project.title}</h3>
        <span className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-brand-gray hover:bg-black/5 hover:text-brand-red">
          Volver
          <X className="h-3.5 w-3.5" />
        </span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">
        Cliente: <span className="text-brand-dark">{project.clientName}</span> · Año:{' '}
        <span className="text-brand-dark">{project.year}</span>
      </p>

      <p className="text-sm leading-relaxed text-brand-gray">{project.description}</p>

      {project.scopeGroups ? (
        <div className="flex flex-col gap-2.5">
          {project.scopeGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-bold text-brand-red">{group.title}</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full bg-brand-border-soft px-2.5 py-1 text-[11px] text-brand-dark">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {project.scope.map((item) => (
            <li key={item} className="rounded-full bg-brand-border-soft px-2.5 py-1 text-[11px] text-brand-dark">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
