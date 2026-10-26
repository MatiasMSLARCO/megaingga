import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConversation, useSendMessage } from '@/hooks/useChat'

const QUICK_REPLIES = [
  '¿A qué hora estimada llega?',
  'Descarga en puerta de bodega',
  'Ya estamos listos en obra',
  'Llamar al llegar a garita',
  'Gracias, recibido',
]

interface DriverChatProps {
  conversationId: string
  className?: string
}

export function DriverChat({ conversationId, className }: DriverChatProps) {
  const { data: conversation } = useConversation(conversationId)
  const sendMessage = useSendMessage(conversationId)
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [conversation?.messages.length])

  const handleSend = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    sendMessage.mutate(trimmed)
    setText('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend(text)
  }

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-3">
        {conversation?.messages.map((m) => (
          <div key={m.id} className={cn('flex', m.from === 'cliente' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-3 py-2 text-xs',
                m.from === 'cliente' ? 'bg-brand-dark text-white' : 'bg-brand-border-soft text-brand-dark'
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sendMessage.isPending && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-brand-border-soft px-3 py-2 text-xs text-brand-gray">Escribiendo…</div>
          </div>
        )}
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSend(q)}
            className="shrink-0 cursor-pointer rounded-full border border-brand-border px-3 py-1 text-[11px] font-medium text-brand-gray transition-colors hover:border-brand-red hover:text-brand-red"
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-brand-border-soft p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="h-10 flex-1 rounded-md border border-brand-border bg-white px-3 text-sm outline-none transition-colors focus:border-brand-red"
        />
        <button
          type="submit"
          aria-label="Enviar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-red text-white transition-colors hover:bg-brand-red/90 cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
