import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useBackofficeAuth } from '@/context/BackofficeAuthContext'

export function RequireBackofficeAuth({ children }: { children: ReactNode }) {
  const { session } = useBackofficeAuth()

  if (!session) {
    return <Navigate to="/backoffice/ingresar" replace />
  }

  return <>{children}</>
}
