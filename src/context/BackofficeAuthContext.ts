import { createContext, useContext } from 'react'
import type { AdminSession } from '@/types/auth.types'

export interface BackofficeAuthContextValue {
  session: AdminSession | null
  login: (name?: string) => void
  logout: () => void
}

export const BackofficeAuthContext = createContext<BackofficeAuthContextValue | null>(null)

export function useBackofficeAuth() {
  const ctx = useContext(BackofficeAuthContext)
  if (!ctx) throw new Error('useBackofficeAuth debe usarse dentro de BackofficeAuthProvider')
  return ctx
}
