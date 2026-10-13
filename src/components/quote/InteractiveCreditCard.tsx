import { useMemo } from 'react'
import { Eye, EyeOff, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InteractiveCreditCardProps {
  cardNumber: string
  cardholderName: string
  expiry: string
  cvv: string
  isFlipped: boolean
  onToggleFlip?: () => void
  isSuccess?: boolean
  maskNumbers?: boolean
  onToggleMask?: () => void
  className?: string
}

export function InteractiveCreditCard({
  cardNumber,
  cardholderName,
  expiry,
  cvv,
  isFlipped,
  onToggleFlip,
  isSuccess = false,
  maskNumbers = true,
  onToggleMask,
  className,
}: InteractiveCreditCardProps) {
  // Detección de marca de tarjeta
  const cardBrand = useMemo(() => {
    const clean = cardNumber.replace(/\s/g, '')
    if (clean.startsWith('4')) return 'visa'
    if (clean.startsWith('5')) return 'mastercard'
    if (clean.startsWith('3')) return 'amex'
    return 'visa' // default
  }, [cardNumber])

  // Formato de número con máscara segura de asteriscos ****
  const formattedNumber = useMemo(() => {
    const raw = cardNumber.replace(/\s/g, '')
    if (!raw) return '**** **** **** ****'

    if (maskNumbers) {
      const block1 = raw.length >= 4 ? raw.slice(0, 4) : raw.padEnd(4, '*')
      const block2 = '****'
      const block3 = '****'
      const block4 = raw.length >= 16 ? raw.slice(12, 16) : (raw.length > 12 ? raw.slice(12).padEnd(4, '*') : '****')
      return `${block1} ${block2} ${block3} ${block4}`
    }

    const padded = raw.padEnd(16, '*')
    return [
      padded.slice(0, 4),
      padded.slice(4, 8),
      padded.slice(8, 12),
      padded.slice(12, 16),
    ].join(' ')
  }, [cardNumber, maskNumbers])

  const displayName = cardholderName.trim() ? cardholderName.toUpperCase() : 'NOMBRE DEL TITULAR'
  const displayExpiry = expiry.trim() ? expiry : 'MM/AA'
  const displayCvv = useMemo(() => {
    if (!cvv.trim()) return '***'
    if (maskNumbers) return '***'
    return cvv.trim()
  }, [cvv, maskNumbers])

  return (
    <div
      className={cn('perspective-card select-none cursor-pointer', className)}
      onClick={onToggleFlip}
      title="Haz clic para voltear la tarjeta"
    >
      <div
        className={cn(
          'relative w-full aspect-[1.586/1] max-w-[360px] mx-auto rounded-2xl preserve-3d transition-transform duration-700 ease-out shadow-2xl',
          isFlipped && 'rotate-y-180',
          isSuccess
            ? 'shadow-[0_0_45px_rgba(34,197,94,0.45)] ring-2 ring-emerald-500/60'
            : 'shadow-slate-900/35 hover:shadow-slate-900/45'
        )}
      >
        {/* ========================================================= */}
        {/* CARA FRONTAL DE LA TARJETA                                */}
        {/* ========================================================= */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden',
            'bg-gradient-to-tr from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white border border-white/15'
          )}
        >
          {/* Brillo radial / gradiente de iluminación */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />

          {/* Fila superior: Chip EMV + Contactless + Categoría */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Chip EMV Metálico con textura */}
              <div className="relative h-8 w-11 rounded-md bg-gradient-to-br from-[#ffd700] via-[#e5b800] to-[#b38f00] p-0.5 shadow-sm border border-amber-300/60 overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-around opacity-40">
                  <div className="h-px w-full bg-amber-900" />
                  <div className="h-px w-full bg-amber-900" />
                  <div className="h-px w-full bg-amber-900" />
                </div>
                <div className="absolute inset-0 flex justify-around opacity-40">
                  <div className="h-full w-px bg-amber-900" />
                  <div className="h-full w-px bg-amber-900" />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-4 rounded-xs border border-amber-900/50" />
              </div>

              {/* Ícono Contactless */}
              <Wifi className="h-4 w-4 rotate-90 text-white/80" />
            </div>

            <div className="flex items-center gap-2">
              {onToggleMask && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleMask()
                  }}
                  title={maskNumbers ? 'Mostrar números completos' : 'Ocultar con ****'}
                  className="rounded-full bg-white/10 hover:bg-white/25 p-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  {maskNumbers ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              )}
              <div className="text-right">
                <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-white/70">
                  PLATINUM
                </span>
                <div className="text-[9px] font-medium tracking-wider text-white/40">
                  MEGAINGGA
                </div>
              </div>
            </div>
          </div>

          {/* Fila central: Número de tarjeta con tracking amplio */}
          <div className="relative z-10 my-auto pt-2">
            <div className="font-mono text-base sm:text-lg md:text-xl font-bold tracking-[0.16em] text-white drop-shadow-md">
              {formattedNumber}
            </div>
          </div>

          {/* Fila inferior: Nombre, Expiración y Logo de Red */}
          <div className="relative z-10 flex items-end justify-between gap-2 pt-1 border-t border-white/10">
            <div className="min-w-0 flex-1">
              <div className="text-[8px] font-semibold uppercase tracking-wider text-white/50">
                Cardholder Name
              </div>
              <div className="truncate font-mono text-xs sm:text-sm font-bold tracking-wide text-white drop-shadow-sm">
                {displayName}
              </div>
            </div>

            <div className="text-center px-2">
              <div className="text-[8px] font-semibold uppercase tracking-wider text-white/50">
                Expires
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white drop-shadow-sm">
                {displayExpiry}
              </div>
            </div>

            {/* Logo de la Franquicia */}
            <div className="shrink-0 flex items-center justify-end">
              {cardBrand === 'mastercard' ? (
                <div className="flex items-center -space-x-2.5">
                  <div className="h-6 w-6 rounded-full bg-[#EB001B]/95 shadow-sm" />
                  <div className="h-6 w-6 rounded-full bg-[#F79E1B]/90 shadow-sm" />
                </div>
              ) : (
                <div className="font-serif italic font-extrabold text-lg sm:text-xl tracking-tighter text-white drop-shadow-md flex items-center gap-0.5">
                  <span className="text-blue-400">V</span>
                  <span>ISA</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARA POSTERIOR DE LA TARJETA (REVERSO CON CVV)            */}
        {/* ========================================================= */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rotate-y-180 rounded-2xl flex flex-col justify-between overflow-hidden',
            'bg-gradient-to-tr from-[#0a0f1d] via-[#141b2d] to-[#1f293d] text-white border border-white/15'
          )}
        >
          {/* Banda magnética negra superior */}
          <div className="mt-5 h-10 w-full bg-[#05080f] shadow-inner" />

          {/* Panel de firma y CVV */}
          <div className="px-5 sm:px-6">
            <div className="flex items-center justify-between text-[8px] text-white/50 uppercase tracking-widest mb-1">
              <span>Authorized Signature</span>
              <span>CVV / CVC</span>
            </div>

            <div className="flex h-9 w-full items-center justify-between rounded bg-zinc-200 px-3 shadow-inner">
              {/* Líneas tenues de seguridad en la banda de firma */}
              <div className="h-full flex-1 flex flex-col justify-around py-1 opacity-25">
                <div className="h-px bg-zinc-600" />
                <div className="h-px bg-zinc-600" />
                <div className="h-px bg-zinc-600" />
              </div>

              {/* Número secreto CVV */}
              <div className="pl-3 font-mono text-xs sm:text-sm font-extrabold tracking-widest text-zinc-900">
                {displayCvv}
              </div>
            </div>
          </div>

          {/* Texto legal y sello holográfico inferior */}
          <div className="px-5 sm:px-6 pb-4 flex items-center justify-between text-[7px] text-white/40 leading-tight">
            <div className="max-w-[210px]">
              MEGA INGENIERÍA S.A. · B2B CHECKOUT DEMO · FOR VALIDATION AND TESTING PURPOSES ONLY.
            </div>
            <div className="h-6 w-6 rounded-full border border-white/20 bg-gradient-to-tr from-amber-400/30 to-blue-400/30 flex items-center justify-center font-mono text-[7px] text-white/70">
              SEC
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
