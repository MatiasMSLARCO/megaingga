import { createContext, useContext } from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  durationMs?: number
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}
