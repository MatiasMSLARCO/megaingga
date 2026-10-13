import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, id, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wide text-brand-gray">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-11 rounded-md border border-brand-border bg-white px-3 text-sm text-brand-dark placeholder:text-brand-gray/60 outline-none transition-colors focus:border-brand-red',
          error && 'border-brand-red',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-brand-red">{error}</span>}
    </div>
  )
})
