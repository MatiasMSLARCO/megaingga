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

export function ClientsSection() {
  return (
    <section id="clientes" className="bg-brand-border-soft/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-brand-dark sm:text-4xl">
            Gracias por su confianza
          </h2>
          <div className="mt-3 h-1 w-16 bg-brand-red" />
          <p className="mt-4 text-sm leading-relaxed text-brand-gray">
            Empresas e instituciones que han confiado en Mega Ingeniería para sus proyectos, incluyendo{' '}
            <span className="font-semibold text-brand-dark">Siemens Healthineers</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {CLIENT_LOGOS.map((logo) => (
            <div
              key={logo}
              className="flex h-24 items-center justify-center rounded-lg border border-brand-border-soft bg-white p-4 grayscale transition-all hover:grayscale-0"
            >
              <img src={logo} alt="Logo de cliente" className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
