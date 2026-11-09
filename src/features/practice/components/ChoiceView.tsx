import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpeakButton } from '@/components/ui/SpeakButton';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sounds';
import type { Card } from '../engine';
import { makeChoices, shownAnswer } from '../choices';

/** Meerkeuze: vier opties, toetsen 1 t/m 4 werken ook. */
export function ChoiceView({ card, pool, onAnswer }: { card: Card; pool: Card[]; onAnswer: (correct: boolean, given: string) => void }) {
  const options = useMemo(() => makeChoices(card, pool), [card, pool]);
  const right = shownAnswer(card);
  const [picked, setPicked] = useState<string | null>(null);
  const next = useRef<HTMLButtonElement>(null);

  useEffect(() => setPicked(null), [card.key]);

  const pick = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (o === right) {
      play('goed');
      setTimeout(() => onAnswer(true, o), 650);
    } else {
      play('fout');
      setTimeout(() => next.current?.focus(), 50);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) pick(options[n - 1]!);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5">
      <div className="flex w-full flex-col items-center gap-1 rounded-[28px] border border-line bg-surface px-6 py-8 text-center shadow-soft">
        <span className="text-[clamp(26px,7vw,40px)] leading-tight font-extrabold tracking-[-0.02em] break-words" lang={card.promptLang}>
          {card.prompt}
        </span>
        <SpeakButton text={card.prompt} lang={card.promptLang} />
      </div>
      <ul className="grid w-full gap-2">
        {options.map((o, i) => {
          const isRight = picked && o === right;
          const isWrong = picked === o && o !== right;
          return (
            <li key={o}>
              <motion.button
                type="button"
                onClick={() => pick(o)}
                disabled={!!picked}
                animate={isRight ? { scale: [1, 1.04, 1] } : isWrong ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.35 }}
                className={cn(
                  'flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-lg font-semibold transition-colors',
                  isRight ? 'border-primary bg-primary-soft text-primary-ink' : isWrong ? 'border-danger bg-danger/10 text-danger' : 'border-line bg-surface hover:border-ink-soft',
                  picked && !isRight && !isWrong && 'opacity-60',
                )}
                lang={card.answerLang}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-sm text-ink-soft" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="flex-1">{o}</span>
                {isRight && <Check size={22} aria-label="goed" />}
                {isWrong && <X size={22} aria-label="fout" />}
              </motion.button>
            </li>
          );
        })}
      </ul>
      {picked && picked !== right && (
        <Button ref={next} size="lg" className="w-full justify-center" onClick={() => onAnswer(false, picked)}>
          Volgende
        </Button>
      )}
    </div>
  );
}
