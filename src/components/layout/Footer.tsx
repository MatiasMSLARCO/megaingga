import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { companyInfo } from '@/data/company.data'
import { Logo } from '@/components/ui/Logo'

const INSTITUTIONAL_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#suministros', label: 'Insumos' },
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/#clientes', label: 'Clientes' },
  { href: '/#contacto', label: 'Contacto' },
]

const currentYear = new Date().getFullYear()

export function Footer() {
  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}`

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/') {
      if (window.location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        window.history.pushState(null, '', '/')
      }
      return
    }
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      const el = document.getElementById(targetId)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.history.pushState(null, '', href)
      }
    }
  }

  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <Link to="/" className="w-fit" onClick={(e) => handleNavClick(e, '/')}>
            <Logo className="h-8 w-auto" alt={companyInfo.brandName} />
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-white/60">{companyInfo.legalName}</p>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            Ingeniería y construcción de infraestructura hospitalaria, climatización industrial y proyectos civiles,
            mecánicos y eléctricos en {companyInfo.country}.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-white/50">Navegación</h3>
          <ul className="flex flex-col gap-2">
            {INSTITUTIONAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-white/70 transition-colors hover:text-brand-red"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-white/50">Contacto</h3>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-brand-red"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {companyInfo.officialPhone}
          </a>
          <a
            href={`mailto:${companyInfo.contactEmail}`}
            className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-brand-red"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {companyInfo.contactEmail}
          </a>
          <span className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 shrink-0" />
            {companyInfo.country}
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/40 sm:px-6 lg:px-8">
        © {currentYear} {companyInfo.legalName}. Todos los derechos reservados.
      </div>
    </footer>
  )
}
