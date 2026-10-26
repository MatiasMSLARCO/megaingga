import { AlertTriangle, HelpCircle, Loader2 } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'brand' | 'success'
  isPending?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'brand',
  isPending = false,
}: ConfirmationModalProps) {
  const isDanger = variant === 'danger'

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              isDanger ? 'bg-red-100 text-brand-red' : 'bg-brand-red/10 text-brand-red'
            }`}
          >
            {isDanger ? <AlertTriangle className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-dark">{title}</h3>
            <p className="mt-1 text-xs text-brand-gray leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 border-t border-brand-border-soft pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isPending}
            className="text-xs"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isPending}
            className={`text-xs gap-1.5 font-bold ${
              isDanger
                ? 'bg-brand-red hover:bg-brand-red/90 text-white'
                : 'bg-brand-dark hover:bg-black text-white'
            }`}
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
