import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string // etiqueta corta en lenguaje plano (sin número); omitir donde el título se explica solo
  title: ReactNode
  subtitle?: ReactNode
  tone?: 'light' | 'dark'
  actions?: ReactNode // slot a la derecha (botón, link)
  className?: string
}

// Encabezado de sección unificado: título serif editorial + etiqueta opcional.
// Propaga el lenguaje visual del Hero (blueprint/editorial) a la web.
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = 'light',
  actions,
  className,
}: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <div className={cn('flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <div
            className={cn(
              'flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]',
              dark ? 'text-[#e6e1d4]/60' : 'text-brand-gray'
            )}
          >
            <span className="h-px w-8 bg-brand-red" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h2
          className={cn(
            'mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem] pb-1',
            dark ? 'text-[#f4efe2]' : 'text-brand-dark'
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              'mt-5 max-w-xl text-base leading-relaxed',
              dark ? 'text-[#e6e1d4]/70' : 'text-brand-gray'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}
