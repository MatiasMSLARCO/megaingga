import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { AdminSession, AdminUser } from '@/types/auth.types'
import { BackofficeAuthContext } from './BackofficeAuthContext'

const STORAGE_KEY = 'megaingga_backoffice_session'

const DEMO_ADMIN: AdminUser = {
  id: 'admin-demo-01',
  fullName: 'Equipo de Operaciones',
  role: 'admin',
  avatarInitials: 'OP',
}

function readStoredSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : null
  } catch {
    return null
  }
}

export function BackofficeAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => readStoredSession())

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  const login = useCallback((name?: string) => {
    const user: AdminUser = name ? { ...DEMO_ADMIN, fullName: name } : DEMO_ADMIN
    setSession({ user, loggedInAt: new Date().toISOString() })
  }, [])

  const logout = useCallback(() => setSession(null), [])

  return <BackofficeAuthContext.Provider value={{ session, login, logout }}>{children}</BackofficeAuthContext.Provider>
}
