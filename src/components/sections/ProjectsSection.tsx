import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjects } from '@/hooks/useProjects'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { ProjectDivision } from '@/types/project.types'

type ProjectFilter = ProjectDivision | 'all'

const DIVISIONS: { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'hospitalario', label: 'Hospitalarios' },
  { value: 'mecanico', label: 'Mecánicos' },
  { value: 'electrico', label: 'Eléctricos' },
  { value: 'civil', label: 'Civiles' },
]

const DIVISION_LABEL: Record<ProjectDivision, string> = {
  hospitalario: 'Hospitalario',
  civil: 'Civil',
  mecanico: 'Mecánico',
  electrico: 'Eléctrico',
}

export function ProjectsSection() {
  const [division, setDivision] = useState<ProjectFilter>('all')
  const { data: projects, isLoading } = useProjects({ division: division === 'all' ? undefined : division })

  return (
    <section id="proyectos" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-brand-dark sm:text-4xl">
            Portafolio de Obras Ejecutadas
          </h2>
          <div className="mt-3 h-1 w-16 bg-brand-red" />
          <p className="mt-4 text-sm leading-relaxed text-brand-gray">
            Proyectos civiles, mecánicos, eléctricos y hospitalarios ejecutados por Mega Ingeniería en Ecuador.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {DIVISIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDivision(d.value)}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors cursor-pointer',
                division === d.value
                  ? 'border-brand-red bg-brand-red text-white'
                  : 'border-brand-border text-brand-gray hover:border-brand-red hover:text-brand-red'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-72 animate-pulse rounded-lg bg-brand-border-soft" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects?.map((project) => (
              <Card key={project.id} className="flex flex-col overflow-hidden sm:flex-row">
                <div className="aspect-[4/3] w-full shrink-0 overflow-hidden bg-brand-border-soft sm:aspect-auto sm:w-56">
                  <img src={project.mainImageUrl} alt={project.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={project.featured ? 'red' : 'dark'}>{DIVISION_LABEL[project.division]}</Badge>
                    {project.featured && <Badge variant="outline">Caso destacado</Badge>}
                  </div>
                  <h3 className="text-base font-bold text-brand-dark">{project.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-brand-gray">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {project.location}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">
                    Cliente: <span className="text-brand-dark">{project.clientName}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-brand-gray">{project.description}</p>
                  {project.scopeGroups ? (
                    <div className="mt-1 flex flex-col gap-2">
                      {project.scopeGroups.map((group) => (
                        <div key={group.title}>
                          <p className="text-xs font-bold text-brand-red">{group.title}</p>
                          <ul className="mt-1 flex flex-wrap gap-1.5">
                            {group.items.map((item) => (
                              <li
                                key={item}
                                className="rounded-full bg-brand-border-soft px-2.5 py-1 text-[11px] text-brand-dark"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="mt-1 flex flex-wrap gap-1.5">
                      {project.scope.map((item) => (
                        <li key={item} className="rounded-full bg-brand-border-soft px-2.5 py-1 text-[11px] text-brand-dark">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
