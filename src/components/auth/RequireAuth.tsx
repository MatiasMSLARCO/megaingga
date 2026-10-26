import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth()

  if (!session) {
    return <Navigate to="/ingresar" replace />
  }

  return <>{children}</>
}
