import { createContext, useContext } from 'react'
import type { Session } from '@/types/auth.types'

export interface AuthContextValue {
  session: Session | null
  login: (email?: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
