import { ShieldCheck, Layers, Cpu, Building } from 'lucide-react'
import { companyInfo } from '@/data/company.data'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const PILLARS = [
  {
    icon: Building,
    title: 'Infraestructura Hospitalaria',
    body: 'Quirófanos, salas de UCI, imagenología con blindaje plomado, pisos conductivos y acabados en acero inoxidable AISI 304.',
    note: 'Cumplimiento normativo MSP / INEN',
  },
  {
    icon: Layers,
    title: 'Termomecánica y Fluidos',
    body: 'Climatización HVAC de alta eficiencia, unidades manejadoras de aire, filtración HEPA, calderos de vapor y redes contra incendios.',
    note: 'Filtración y control de presiones',
  },
  {
    icon: Cpu,
    title: 'Electricidad y Estructuras',
    body: 'Tableros de distribución de potencia, sistemas de generación de emergencia, montaje electromecánico y estructuras metálicas.',
    note: 'Continuidad operativa crítica',
  },
]

export function AboutSection() {
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.08 })

  return (
    <section
      ref={ref}
      id="nosotros"
      className="blueprint-grid border-t border-[#EAE8E3] bg-[#FAF9F6] py-24 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal>
          <SectionHeading
            eyebrow="Quiénes Somos"
            title={
              <>
                Diseño y construcción de <span className="italic text-brand-red">infraestructura hospitalaria</span>.
              </>
            }
            subtitle="Empresa ecuatoriana especializada en diseño, construcción y mantenimiento de infraestructura hospitalaria, climatización HVAC, tableros eléctricos de potencia, sistemas de vapor y montaje de estructuras industriales."
          />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-gray">
            {companyInfo.legalName}
          </p>
        </div>

        {/* Pilares técnicos: filas editoriales con índice, no tarjetas */}
        <div data-reveal className="mt-16 grid gap-px overflow-hidden rounded-lg bg-[#EAE8E3] sm:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.title} className="flex flex-col justify-between bg-[#FAF9F6] p-7">
                <div>
                  <Icon className="h-6 w-6 text-brand-dark" strokeWidth={1.5} />
                  <h3 className="mt-5 font-serif text-xl font-semibold text-brand-dark">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-gray">{p.body}</p>
                </div>
                <span className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-brand-dark/70">
                  <span className="h-px w-4 bg-brand-red" />
                  {p.note}
                </span>
              </div>
            )
          })}
        </div>

        {/* Política de calidad: bloque oscuro (ritmo visual) */}
        <div
          data-reveal
          className="blueprint-grid-dark relative mt-10 flex flex-col gap-5 overflow-hidden rounded-lg bg-brand-ink p-8 sm:flex-row sm:items-start sm:p-10"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-red text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand-red">
              Política de Calidad y Compromiso Técnico
            </h4>
            <p className="mt-3 max-w-3xl font-serif text-lg leading-relaxed text-[#f4efe2] sm:text-xl">
              {companyInfo.qualityPolicy}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
