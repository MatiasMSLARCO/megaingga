import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { ClientUser, Session } from '@/types/auth.types'
import { AuthContext } from './AuthContext'

const STORAGE_KEY = 'megaingga_session'

const DEMO_USER: ClientUser = {
  id: 'cliente-demo-01',
  fullName: 'Ing. Carla Ruiz',
  companyName: 'Constructora Andes S.A.',
  email: 'carla.ruiz@constructoraandes.com',
  phone: '+593 99 123 4567',
  avatarInitials: 'CR',
}

function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readStoredSession())

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  const login = useCallback((email?: string) => {
    const user: ClientUser = email ? { ...DEMO_USER, email } : DEMO_USER
    setSession({ user, loggedInAt: new Date().toISOString() })
  }, [])

  const logout = useCallback(() => setSession(null), [])

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>
}
