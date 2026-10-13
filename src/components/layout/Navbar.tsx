import { useState } from 'react'
import { Link } from 'react-router'
import { Menu, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { companyInfo } from '@/data/company.data'
import { Logo } from '@/components/ui/Logo'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/tienda', label: 'Servicios' },
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/#clientes', label: 'Clientes' },
  { href: '/#contacto', label: 'Contacto' },
]

interface NavbarProps {
  quoteCount: number
  onOpenQuote: () => void
  isScrolled: boolean
}

export function Navbar({ quoteCount, onOpenQuote, isScrolled }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const isSolid = isScrolled || mobileOpen

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 border-b transition-colors duration-300',
        isSolid ? 'border-brand-border-soft bg-white/95 backdrop-blur-md shadow-xs' : 'border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center shrink-0">
          <Logo className="h-9 w-auto" alt={companyInfo.brandName} />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  'text-xs font-semibold uppercase tracking-wide transition-colors hover:text-brand-red',
                  isSolid ? 'text-zinc-700' : 'text-white/90'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenQuote}
            className="relative inline-flex h-10 items-center gap-2 rounded-md bg-brand-red px-3.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-red/90 cursor-pointer sm:px-4"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Cotizar</span>
            {quoteCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-dark px-1 text-[10px] font-bold text-white">
                {quoteCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Abrir menú"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors cursor-pointer lg:hidden',
              isSolid ? 'text-brand-dark hover:bg-black/5' : 'text-white hover:bg-white/10'
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className={cn('overflow-hidden border-t border-brand-border-soft bg-white transition-all lg:hidden', mobileOpen ? 'max-h-96' : 'max-h-0 border-t-0')}>
        <ul className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-brand-dark hover:bg-black/5"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
