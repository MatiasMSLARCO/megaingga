import { LayoutGrid, LayoutPanelTop } from 'lucide-react'
import { SITE_MODE_STORAGE_KEY, type SiteMode } from './siteMode'

interface ModeToggleProps {
  mode: SiteMode
}

export function ModeToggle({ mode }: ModeToggleProps) {
  const handleToggle = () => {
    const next: SiteMode = mode === 'landing' ? 'multipage' : 'landing'
    localStorage.setItem(SITE_MODE_STORAGE_KEY, next)
    window.location.reload()
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={mode === 'landing' ? 'Cambiar a versión multipágina' : 'Cambiar a versión landing'}
      className="fixed bottom-3 left-3 z-[200] flex items-center gap-1.5 rounded-full border border-brand-border-soft bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gray shadow-sm backdrop-blur-sm transition-colors hover:border-brand-red hover:text-brand-red"
    >
      {mode === 'landing' ? <LayoutPanelTop className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
      {mode === 'landing' ? 'Landing' : 'Multipágina'}
    </button>
  )
}
