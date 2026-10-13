import { useState } from 'react'
import {
  Sparkles,
  Zap,
  Layers,
  Code2,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react'
import { cn } from './lib/utils'

export default function App() {
  const [count, setCount] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('npm run dev')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const features = [
    {
      icon: Zap,
      title: 'Vite + React 19',
      desc: 'Compilación ultrarrápida, HMR instantáneo y el ecosistema más moderno.',
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    },
    {
      icon: Code2,
      title: 'TypeScript Estricto',
      desc: 'Soporte completo de tipado estático con alias de rutas configurados (@/*).',
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    },
    {
      icon: Layers,
      title: 'Tailwind CSS v4',
      desc: 'Motor de utilidades nativo vía @tailwindcss/vite con @import "tailwindcss".',
      color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    },
    {
      icon: Sparkles,
      title: 'cn() Utility & Lucide',
      desc: 'Combinación inteligente de clases con clsx + tailwind-merge e iconos vectoriales.',
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6 sm:p-12 relative overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Top Navigation */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-slate-800/80 z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg text-white">megaingga</span>
            <span className="ml-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              React + Vite + TS
            </span>
          </div>
        </div>

        <a
          href="https://github.com/MatiasMSLARCO/megaingga"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <span>GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Main Hero Content */}
      <main className="w-full max-w-5xl flex flex-col items-center text-center my-12 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-8 backdrop-blur shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Proyecto inicializado y listo para desarrollo</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-6">
          Desarrolla interfaces modernas con{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            React & Tailwind v4
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Base preconfigurada con tipado TypeScript estricto, utilidades modulares, recarga instantánea y arquitectura lista para escalar.
        </p>

        {/* Quick action buttons & Counter */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={() => setCount((c) => c + 1)}
            className={cn(
              'px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer',
              'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25'
            )}
          >
            <Sparkles className="w-4 h-4" />
            <span>Contador interactivo:</span>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded-md text-xs font-semibold">
              {count}
            </span>
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>npm run dev</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500 ml-1" />
            )}
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 backdrop-blur hover:-translate-y-0.5"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center border mb-4 transition-transform group-hover:scale-105',
                    feature.color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-1.5">
                  {feature.title}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between pt-8 pb-4 border-t border-slate-800/60 text-xs text-slate-500 gap-4 z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>megaingga - Entorno de desarrollo React activo</span>
        </div>
        <p>Edita <code className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono">src/App.tsx</code> para comenzar.</p>
      </footer>
    </div>
  )
}
