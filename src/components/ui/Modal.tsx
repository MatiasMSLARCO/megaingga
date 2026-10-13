import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, className, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl',
          className
        )}
      >
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-border-soft bg-white px-6 py-4">
            <h2 className="text-lg font-bold uppercase tracking-wide text-brand-dark">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-full p-1.5 text-brand-gray transition-colors hover:bg-black/5 hover:text-brand-red cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full p-1.5 text-brand-gray transition-colors hover:bg-black/5 hover:text-brand-red cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div className={title ? 'p-6' : 'p-6'}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
