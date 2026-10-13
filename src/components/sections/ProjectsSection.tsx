import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useProjects } from '@/hooks/useProjects'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ProjectFlipCard } from '@/components/sections/ProjectFlipCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { ProjectDivision } from '@/types/project.types'

type ProjectFilter = ProjectDivision | 'all'

const DIVISIONS: { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'hospitalario', label: 'Hospitalarios' },
  { value: 'mecanico', label: 'Mecánicos' },
  { value: 'electrico', label: 'Eléctricos' },
  { value: 'civil', label: 'Civiles' },
]

export function ProjectsSection() {
  const [division, setDivision] = useState<ProjectFilter>('all')
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const { data: projects, isLoading } = useProjects({ division: division === 'all' ? undefined : division })
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.1, deps: [projects, isLoading] })

  return (
    <section ref={ref} id="proyectos" className="blueprint-grid-dark bg-brand-ink py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-10">
          <SectionHeading
            eyebrow="Portafolio"
            tone="dark"
            title={
              <>
                Obras <span className="italic text-brand-red">ejecutadas</span>.
              </>
            }
            subtitle="Proyectos civiles, mecánicos, eléctricos y hospitalarios ejecutados por Mega Ingeniería en Ecuador."
          />
        </div>

        <div data-reveal className="mb-8 flex flex-wrap gap-2">
          {DIVISIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDivision(d.value)}
              className={cn(
                'rounded-full border px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-wide transition-colors cursor-pointer',
                division === d.value
                  ? 'border-brand-red bg-brand-red text-white'
                  : 'border-white/20 text-[#e6e1d4]/70 hover:border-brand-red hover:text-brand-red'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-[28rem] animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects?.map((project) => (
              <div key={project.id} data-reveal>
                <ProjectFlipCard
                  project={project}
                  isFlipped={flippedId === project.id}
                  onToggle={() => setFlippedId((current) => (current === project.id ? null : project.id))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
