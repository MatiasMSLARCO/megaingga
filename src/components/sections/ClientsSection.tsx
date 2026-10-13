import { useScrollReveal } from '@/hooks/useScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const CLIENT_LOGOS = [
  '/assets/images/clients/cliente-omni-hospital.webp',
  '/assets/images/clients/cliente-logo-01.webp',
  '/assets/images/clients/cliente-logo-02.webp',
  '/assets/images/clients/cliente-logo-03.webp',
  '/assets/images/clients/cliente-logo-04.webp',
  '/assets/images/clients/cliente-logo-05.webp',
  '/assets/images/clients/cliente-logo-06.webp',
  '/assets/images/clients/cliente-logo-07.webp',
  '/assets/images/clients/cliente-logo-08.webp',
]

// Duplicado una vez para el loop continuo (el track se desplaza -50%, que equivale
// exactamente al ancho de una copia completa de la lista).
const MARQUEE_LOGOS = [...CLIENT_LOGOS, ...CLIENT_LOGOS]

export function ClientsSection() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} id="clientes" className="overflow-hidden border-t border-[#EAE8E3] bg-[#FAF9F6] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-12">
          <SectionHeading
            title={
              <>
                Gracias por su <span className="italic text-brand-red">confianza</span>.
              </>
            }
            subtitle={
              <>
                Empresas e instituciones que han confiado en Mega Ingeniería para sus proyectos, incluyendo{' '}
                <span className="font-semibold text-brand-dark">Siemens Healthineers</span>.
              </>
            }
          />
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF9F6] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF9F6] to-transparent sm:w-28" />

        <div className="group overflow-hidden">
          <div className="flex w-max animate-[marquee-scroll_32s_linear_infinite] gap-6 motion-reduce:animate-none group-hover:[animation-play-state:paused]">
            {MARQUEE_LOGOS.map((logo, idx) => (
              <div
                key={`${logo}-${idx}`}
                className="flex h-24 w-40 shrink-0 items-center justify-center rounded-lg border border-brand-border-soft bg-white p-4 grayscale transition-all hover:grayscale-0"
              >
                <img src={logo} alt="Logo de cliente" className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
