import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send, Truck, Headset } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConversation, useSendAdminMessage } from '@/hooks/useChat'
import type { ChatSender } from '@/types/chat.types'

interface AdminChatProps {
  conversationId: string
  className?: string
}

const SENDER_OPTIONS: { value: ChatSender; label: string; icon: typeof Truck }[] = [
  { value: 'conductor', label: 'Conductor', icon: Truck },
  { value: 'soporte', label: 'Soporte', icon: Headset },
]

export function AdminChat({ conversationId, className }: AdminChatProps) {
  const { data: conversation } = useConversation(conversationId)
  const sendMessage = useSendAdminMessage(conversationId)
  const [text, setText] = useState('')
  const [senderRole, setSenderRole] = useState<ChatSender>('soporte')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [conversation?.messages.length])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage.mutate({ text: trimmed, from: senderRole })
    setText('')
  }

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-3">
        {conversation?.messages.map((m) => (
          <div key={m.id} className={cn('flex', m.from === 'cliente' ? 'justify-start' : 'justify-end')}>
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-3 py-2 text-xs',
                m.from === 'cliente' ? 'bg-brand-border-soft text-brand-dark' : 'bg-brand-dark text-white'
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sendMessage.isPending && (
          <div className="flex justify-end">
            <div className="rounded-lg bg-brand-dark/80 px-3 py-2 text-xs text-white">Enviando…</div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 border-t border-brand-border-soft px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-gray">Responder como:</span>
        {SENDER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSenderRole(opt.value)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer',
              senderRole === opt.value
                ? 'bg-brand-red text-white'
                : 'bg-brand-border-soft text-brand-gray hover:text-brand-dark'
            )}
          >
            <opt.icon className="h-3 w-3" />
            {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-brand-border-soft p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Responder como ${senderRole}...`}
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
