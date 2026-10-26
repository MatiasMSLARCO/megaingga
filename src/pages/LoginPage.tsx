import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router'
import { LogIn, Lock, Package, Truck, FileText } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'

const FEATURES = [
  { icon: Package, text: 'Rastrea tus pedidos y su estado en tiempo real' },
  { icon: Truck, text: 'Ve el envío en vivo con mapa y chat con el conductor' },
  { icon: FileText, text: 'Crea y repite cotizaciones desde tu catálogo' },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(email || undefined)
    navigate('/portal')
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Izquierda: branding Portal de Clientes */}
      <div className="blueprint-grid-dark relative hidden flex-col justify-between bg-brand-dark px-12 py-12 lg:flex xl:px-16">
        <Link to="/">
          <Logo className="h-9 w-auto brightness-0 invert" />
        </Link>

        <div className="max-w-md">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
            <span className="h-px w-8 bg-brand-red" />
            <span>Portal de Clientes</span>
          </div>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-[#f4efe2] xl:text-5xl">
            Tus proyectos, siempre bajo control.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#e6e1d4]/70">
            Gestiona pedidos, cotizaciones y envíos de tus suministros de ingeniería desde un solo lugar.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {FEATURES.map((feature) => (
              <li key={feature.text} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-red">
                  <feature.icon className="h-4.5 w-4.5" />
                </span>
                <span className="mt-1.5 text-sm text-[#e6e1d4]/80">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
          MEGAINGGA S.A. · Quito, Ecuador
        </p>
      </div>

      {/* Derecha: card de ingreso */}
      <div className="flex flex-col items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo className="h-9 w-auto" />
          </div>

          <h2 className="font-serif text-3xl font-semibold text-brand-dark">Ingresar</h2>
          <p className="mt-2 text-sm text-brand-gray">
            Accede para ver tus pedidos, cotizaciones y el seguimiento de tus envíos.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tucorreo@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="mt-2 w-full gap-2">
              <LogIn className="h-4 w-4" />
              Ingresar
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-between border-t border-brand-border-soft pt-5">
            <Link
              to="/"
              className="text-[11px] font-medium text-brand-gray/70 transition-colors hover:text-brand-gray"
            >
              Volver al sitio
            </Link>
            <Link
              to="/backoffice"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-gray/70 transition-colors hover:text-brand-gray"
            >
              <Lock className="h-3 w-3" />
              Acceso backoffice
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
