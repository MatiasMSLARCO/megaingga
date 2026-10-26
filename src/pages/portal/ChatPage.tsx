import { useState } from 'react'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { DriverChat } from '@/components/portal/DriverChat'
import { useConversations } from '@/hooks/useChat'

export function ChatPage() {
  const { data: conversations = [] } = useConversations()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = conversations.find((c) => c.id === selectedId) ?? null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark">Chat</h1>
        <p className="mt-1 text-sm text-brand-gray">Conversaciones con el conductor de tu envío y soporte.</p>
      </div>

      <Card className="grid h-[560px] grid-cols-1 overflow-hidden p-0 md:grid-cols-[280px_1fr]">
        <div
          className={cn(
            'flex flex-col overflow-y-auto border-brand-border-soft md:border-r',
            selected && 'hidden md:flex'
          )}
        >
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                'flex items-center gap-3 border-b border-brand-border-soft px-4 py-3 text-left transition-colors hover:bg-black/[0.03] cursor-pointer',
                selected?.id === conv.id && 'bg-black/[0.03]'
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                {conv.avatarInitials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-brand-dark">{conv.title}</p>
                <p className="truncate text-xs text-brand-gray">{conv.subtitle}</p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-brand-gray">No tienes conversaciones activas.</p>
          )}
        </div>

        <div className={cn('flex flex-col', !selected && 'hidden md:flex')}>
          {selected ? (
            <>
              <div className="flex items-center gap-3 border-b border-brand-border-soft px-4 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="text-brand-gray hover:text-brand-dark md:hidden"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                  {selected.avatarInitials}
                </span>
                <div>
                  <p className="text-sm font-bold text-brand-dark">{selected.title}</p>
                  <p className="text-xs text-brand-gray">{selected.subtitle}</p>
                </div>
              </div>
              <DriverChat conversationId={selected.id} className="flex-1" />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-brand-gray">
              <MessageCircle className="h-8 w-8" />
              <p className="text-sm">Selecciona una conversación</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
