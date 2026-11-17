import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BookOpen, Layers, Library, MessageCircleQuestion, X, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/lib/settings';
import { cn } from '@/lib/cn';

interface Stap {
  icon: LucideIcon | null;
  title: string;
  text: string;
  /** Pagina die past bij deze stap (knop "Laat zien"). */
  to?: string;
}

export const stappen: Stap[] = [
  {
    icon: null,
    title: 'Welkom bij Woordwerk!',
    text: 'Hier leer je woordjes, grammatica en werkwoorden. In vier stapjes zie je wat er allemaal kan.',
  },
  {
    icon: Library,
    title: 'Maak je eigen lijsten',
    text: 'Typ of plak je woordjes, of maak een foto van je boek. Je kunt ook beginnen met een kant-en-klare startlijst.',
    to: '/lijsten',
  },
  {
    icon: Layers,
    title: 'Oefen zoals jij wilt',
    text: 'Flitskaartjes, typen, meerkeuze of een toets. Woorden die je lastig vindt, komen vaker terug. Zo houd je je streak vol.',
    to: '/oefenen',
  },
  {
    icon: BookOpen,
    title: 'Grammatica & werkwoorden',
    text: 'Kies een taal: lees de uitleg, oefen meteen, en train je werkwoorden. Alles op één plek.',
    to: '/grammatica',
  },
];

/**
 * Korte rondleiding die nieuwe bezoekers één keer zien.
 * Opnieuw bekijken kan bij Instellingen.
 */
export function Rondleiding() {
  const gezien = useSettings((s) => s.rondleidingGezien);
  const update = useSettings((s) => s.update);
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [stap, setStap] = useState(0);
  const primary = useRef<HTMLButtonElement>(null);

  const open = !gezien;
  const laatste = stap === stappen.length - 1;
  const huidig = stappen[stap]!;

  useEffect(() => {
    if (open) setStap(0);
  }, [open]);
  useEffect(() => {
    if (open) primary.current?.focus();
  }, [open, stap]);

  const sluit = (to?: string) => {
    update({ rondleidingGezien: true });
    if (to) navigate(to);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rondleiding-titel"
            aria-describedby="rondleiding-tekst"
            className="relative w-full max-w-md rounded-[28px] bg-surface p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] shadow-soft sm:pb-6"
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') sluit();
              if (e.key === 'ArrowRight' && !laatste) setStap(stap + 1);
              if (e.key === 'ArrowLeft' && stap > 0) setStap(stap - 1);
            }}
          >
            <button
              type="button"
              onClick={() => sluit()}
              aria-label="Rondleiding overslaan"
              className="absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-2"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div key={stap} className="flex flex-col items-center text-center">
              <span className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-3xl text-primary-ink" aria-hidden="true">
                {huidig.icon ? <huidig.icon size={30} /> : '👋'}
              </span>
              <h2 id="rondleiding-titel" className="text-2xl font-extrabold tracking-tight">
                {huidig.title}
              </h2>
              <p id="rondleiding-tekst" className="mt-2 text-ink-soft">
                {huidig.text}
              </p>
              {laatste && (
                <p className="mt-3 flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm text-ink-soft">
                  <MessageCircleQuestion size={18} className="shrink-0 text-primary-ink" aria-hidden="true" />
                  Vragen? De ronde knop rechtsonder helpt je verder.
                </p>
              )}
            </div>

            <div className="mt-5 flex justify-center gap-1.5" aria-label={`Stap ${stap + 1} van ${stappen.length}`} role="img">
              {stappen.map((_, i) => (
                <span key={i} className={cn('h-2 rounded-full transition-all', i === stap ? 'w-6 bg-primary' : 'w-2 bg-line')} />
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              {stap > 0 ? (
                <Button variant="secondary" className="flex-1 justify-center" onClick={() => setStap(stap - 1)}>
                  Terug
                </Button>
              ) : (
                <Button variant="ghost" className="flex-1 justify-center" onClick={() => sluit()}>
                  Overslaan
                </Button>
              )}
              <Button
                ref={primary}
                className="flex-1 justify-center"
                onClick={() => (laatste ? sluit() : setStap(stap + 1))}
              >
                {laatste ? 'Aan de slag!' : stap === 0 ? 'Laat zien' : 'Volgende'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
