import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, error, id, ...props },
  ref
) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wide text-brand-gray">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          'min-h-24 rounded-md border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray/60 outline-none transition-colors focus:border-brand-red',
          error && 'border-brand-red',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-brand-red">{error}</span>}
    </div>
  )
})
