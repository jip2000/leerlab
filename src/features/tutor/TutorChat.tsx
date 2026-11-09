import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircleQuestion, Send, X } from 'lucide-react';
import { greeting, localTutor, type TutorEngine } from './engine';
import { suggestions } from './knowledge';
import type { TutorAction } from './knowledge';
import { cn } from '@/lib/cn';

interface Msg {
  from: 'jij' | 'tutor';
  text: string;
  actions?: TutorAction[];
}

const engine: TutorEngine = localTutor;

/** Hulp-tutor: chatknop rechtsonder die je door Woordwerk begeleidt. */
export function TutorChat() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Niet tijdens een oefening (dan zit hij in de weg).
  const hidden = /^\/oefenen\/.+|^\/werkwoorden\/oefenen/.test(pathname);

  useEffect(() => {
    if (open && msgs.length === 0) setMsgs([{ from: 'tutor', text: greeting(pathname) }]);
    if (open) setTimeout(() => input.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [msgs]);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setText('');
    setMsgs((m) => [...m, { from: 'jij', text: q }]);
    const r = await engine.reply(q, { path: pathname });
    setMsgs((m) => [...m, { from: 'tutor', text: r.text, actions: r.actions }]);
  };

  if (hidden) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="tutor"
        aria-label={open ? 'Hulp sluiten' : 'Hulp: vraag het de tutor'}
        className="tutor-button fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-on-primary shadow-soft hover:bg-primary-hover lg:right-6 lg:bottom-6"
      >
        {open ? <X size={24} /> : <MessageCircleQuestion size={26} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            id="tutor"
            role="dialog"
            aria-label="Hulp-tutor"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18 }}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            className="tutor-panel fixed right-2 left-2 z-40 flex max-h-[min(70dvh,560px)] flex-col overflow-hidden rounded-[24px] border border-line bg-surface shadow-soft sm:left-auto sm:w-[380px] lg:right-6 lg:bottom-24"
          >
            <header className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary-ink"><MessageCircleQuestion size={20} aria-hidden="true" /></span>
              <div className="flex-1">
                <h2 className="font-bold">Hulp</h2>
                <p className="text-xs text-ink-soft">Ik ken alles in Woordwerk</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Sluiten" className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-2"><X size={20} /></button>
            </header>
            <div ref={list} className="flex flex-1 flex-col gap-2 overflow-y-auto p-4" aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={cn('max-w-[88%] rounded-2xl px-3.5 py-2.5 whitespace-pre-line', m.from === 'jij' ? 'self-end bg-primary text-on-primary' : 'self-start bg-surface-2')}>
                  <span className="sr-only">{m.from === 'jij' ? 'Jij: ' : 'Tutor: '}</span>
                  {m.text}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.actions.map((a) => (
                        <button key={a.to} type="button" onClick={() => { navigate(a.to); setOpen(false); }} className="h-9 rounded-full bg-primary px-3 text-sm font-semibold text-on-primary">
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {msgs.length <= 1 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button key={s} type="button" onClick={() => void ask(s)} className="min-h-9 rounded-full border border-line px-3 text-left text-sm font-semibold hover:bg-surface-2">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <form className="flex gap-2 border-t border-line p-3" onSubmit={(e) => { e.preventDefault(); void ask(text); }}>
              <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder="Stel je vraag…" aria-label="Je vraag" className="h-11 flex-1 rounded-full border border-line bg-bg px-4" />
              <button type="submit" aria-label="Versturen" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-on-primary disabled:opacity-50" disabled={!text.trim()}>
                <Send size={18} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
