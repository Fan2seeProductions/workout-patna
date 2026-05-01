// Client component for the chat thread. Subscribes to Realtime, sends via server action.
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import { sendMessage, markMessagesRead } from '../../../../lib/actions/messages'
import { ArrowRightIcon, SparkleIcon } from '../../../../components/app/icons'

type Msg = {
  id: string
  sender_id: string
  body: string
  created_at: string
  read_at?: string | null
}

const suggestedPrompts = [
  'What are you training today?',
  'What time are you going?',
  'Legs, push, or cardio?',
  'Want to join this challenge?',
]

export function ChatThread({
  matchId,
  currentUserId,
  otherDisplayName,
  initialMessages,
}: {
  matchId: string
  currentUserId: string
  otherDisplayName: string
  initialMessages: Msg[]
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [pending, start] = useTransition()
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Subscribe to Realtime inserts for this match
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        payload => {
          const m = payload.new as Msg
          setMessages(prev => (prev.some(x => x.id === m.id) ? prev : [...prev, m]))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])

  // Auto-scroll on new messages
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  // Mark messages from the other person as read on mount
  useEffect(() => {
    void markMessagesRead(matchId)
  }, [matchId])

  function send(text: string) {
    const body = text.trim()
    if (!body) return
    setDraft('')
    // Optimistic message
    const tempId = `temp-${Date.now()}`
    const optimistic: Msg = {
      id: tempId,
      sender_id: currentUserId,
      body,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])
    start(async () => {
      const res = await sendMessage(matchId, body)
      if (!res.ok) {
        setMessages(prev => prev.filter(m => m.id !== tempId))
      }
    })
  }

  return (
    <>
      {/* Messages list */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-md px-4 py-4 space-y-2">
          {messages.length === 0 && (
            <div className="text-center text-[12px] text-[var(--color-text-muted)] py-6">
              You matched with {otherDisplayName}. Say something.
            </div>
          )}
          {messages.map(m => {
            const me = m.sender_id === currentUserId
            return (
              <div key={m.id} className={`flex ${me ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-[14px] leading-snug ${
                    me
                      ? 'brand-gradient text-white rounded-br-md'
                      : 'bg-white/[0.05] border border-[var(--color-border)] text-white rounded-bl-md'
                  }`}
                >
                  {m.body}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Suggested prompts */}
      {messages.length === 0 && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur-xl">
          <div className="mx-auto max-w-md px-4 py-2.5">
            <div className="flex items-center gap-1 mb-2 text-[11px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
              <SparkleIcon width={12} height={12} className="text-[var(--color-brand-bright)]" />
              Quick prompts
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {suggestedPrompts.map(p => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium border border-[var(--color-border-bright)] bg-white/[0.04] text-white/85 hover:bg-white/[0.08] whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(draft)
              }
            }}
            placeholder="Message..."
            disabled={pending}
            className="flex-1 h-11 rounded-full border border-[var(--color-border)] bg-white/[0.04] px-4 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)] disabled:opacity-50"
          />
          <button
            onClick={() => send(draft)}
            disabled={pending || !draft.trim()}
            aria-label="Send"
            className="shrink-0 h-11 w-11 rounded-full brand-gradient flex items-center justify-center text-white disabled:opacity-50"
          >
            <ArrowRightIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </>
  )
}
