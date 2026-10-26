import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Lock, LogIn } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useBackofficeAuth } from '@/context/BackofficeAuthContext'

export function BackofficeLoginPage() {
  const { login } = useBackofficeAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(name || undefined)
    navigate('/backoffice')
  }

  return (
    <Card className="w-full max-w-sm p-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-border-soft">
        <Lock className="h-5 w-5 text-brand-dark" />
      </div>
      <h1 className="mt-4 text-center font-serif text-2xl font-semibold text-brand-dark">Acceso interno</h1>
      <p className="mt-1 text-center text-sm text-brand-gray">Panel de operaciones MegaIngga</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Equipo de Operaciones" />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Button type="submit" className="mt-2 w-full gap-2">
          <LogIn className="h-4 w-4" />
          Ingresar
        </Button>
      </form>

      <p className="mt-5 text-center text-[11px] uppercase tracking-wide text-brand-gray/60">
        Demo interna · cualquier dato ingresa
      </p>
    </Card>
  )
}
