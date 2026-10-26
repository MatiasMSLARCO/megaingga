import { Outlet, Link } from 'react-router'
import { Logo } from '@/components/ui/Logo'

export function AuthLayout() {
  return (
    <div className="blueprint-grid-dark flex min-h-screen flex-col items-center justify-center bg-brand-dark px-4 py-12">
      <Link to="/" className="mb-8">
        <Logo className="h-10 w-auto brightness-0 invert" />
      </Link>
      <Outlet />
      <Link to="/" className="mt-8 text-xs font-semibold uppercase tracking-wide text-white/50 hover:text-white">
        Volver al sitio
      </Link>
    </div>
  )
}
