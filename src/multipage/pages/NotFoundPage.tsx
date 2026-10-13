import { Link } from 'react-router'
import { Compass } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada')

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="h-12 w-12 text-brand-gray/40" />
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-brand-dark">Página no encontrada</h1>
      <p className="text-sm text-brand-gray">
        La página que buscas no existe o fue movida. Vuelve al inicio para seguir explorando.
      </p>
      <Link
        to="/"
        className="inline-flex h-11 items-center justify-center rounded-md bg-brand-red px-5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-red/90"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
