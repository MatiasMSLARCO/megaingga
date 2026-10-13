import { Award, Eye, ShieldCheck, Target } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { companyInfo } from '@/data/company.data'

export function AboutSection() {
  return (
    <section id="nosotros" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-brand-dark sm:text-4xl">
            {companyInfo.legalName}
          </h2>
          <div className="mt-3 h-1 w-16 bg-brand-red" />
          <p className="mt-4 text-sm leading-relaxed text-brand-gray">
            Una empresa ecuatoriana especializada en diseño y construcción de infraestructura hospitalaria,
            instalación de tableros eléctricos, sistemas contra incendios, sistemas de vapor y montaje de
            estructuras metálicas.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col gap-3 p-6">
            <Target className="h-8 w-8 text-brand-red" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-dark">Misión</h3>
            <p className="text-sm leading-relaxed text-brand-gray">{companyInfo.mission}</p>
          </Card>
          <Card className="flex flex-col gap-3 p-6">
            <Eye className="h-8 w-8 text-brand-red" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-dark">Visión</h3>
            <p className="text-sm leading-relaxed text-brand-gray">{companyInfo.vision}</p>
          </Card>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-l-4 border-brand-red bg-brand-border-soft/40 p-6 sm:flex-row sm:items-start">
          <ShieldCheck className="h-8 w-8 shrink-0 text-brand-red" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-dark">Política de Calidad</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-gray">{companyInfo.qualityPolicy}</p>
          </div>
        </div>

        <div className="mt-14">
          <div className="mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-red" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark">Valores Corporativos</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {companyInfo.values.map((value, idx) => (
              <div
                key={value}
                className="flex items-center gap-3 rounded-lg border border-brand-border-soft bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-semibold text-brand-dark">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
