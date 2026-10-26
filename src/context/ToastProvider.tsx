import { useCallback, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastContext, type ToastOptions, type ToastVariant } from './ToastContext'

interface ToastEntry extends ToastOptions {
  id: string
}

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const VARIANT_ACCENT: Record<ToastVariant, string> = {
  success: 'border-l-emerald-600 text-emerald-600',
  error: 'border-l-brand-red text-brand-red',
  info: 'border-l-brand-dark text-brand-dark',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Math.random().toString(36).slice(2)}`
      setToasts((current) => [...current, { ...options, id }])
      setTimeout(() => dismiss(id), options.durationMs ?? 4000)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:right-4 sm:left-auto sm:px-0">
        {toasts.map((t) => {
          const variant = t.variant ?? 'info'
          const Icon = VARIANT_ICON[variant]
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                'animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-lg border-l-4 bg-white p-3.5 shadow-lg shadow-black/10',
                VARIANT_ACCENT[variant]
              )}
            >
              <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-brand-dark">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-brand-gray">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Cerrar notificación"
                className="shrink-0 text-brand-gray hover:text-brand-dark cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
