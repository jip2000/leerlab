import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sounds';
import type { Card } from '../engine';
import { makeChoices, shownAnswer } from '../choices';

export const SPEED_SECONDS = 60;

export interface SpeedResult {
  answers: { card: Card; correct: boolean }[];
  bestCombo: number;
}

/** Snel-ronde: 60 seconden, zoveel mogelijk goed. Combo-teller voor goed achter elkaar. */
export function SpeedRound({ cards, onAnswer, onDone }: { cards: Card[]; onAnswer: (card: Card, correct: boolean) => void; onDone: (r: SpeedResult) => void }) {
  const [left, setLeft] = useState(SPEED_SECONDS);
  const [i, setI] = useState(0);
  const [combo, setCombo] = useState(0);
  const [flash, setFlash] = useState<'goed' | 'fout' | null>(null);
  const result = useRef<SpeedResult>({ answers: [], bestCombo: 0 });
  const order = useMemo(() => [...cards].sort(() => Math.random() - 0.5), [cards]);
  const card = order[i % order.length]!;
  const options = useMemo(() => makeChoices(card, cards), [card, cards, i]);

  useEffect(() => {
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (left <= 0) onDone(result.current);
  }, [left]);

  const pick = (o: string) => {
    if (left <= 0) return;
    const ok = o === shownAnswer(card);
    play(ok ? 'goed' : 'fout');
    result.current.answers.push({ card, correct: ok });
    const c = ok ? combo + 1 : 0;
    result.current.bestCombo = Math.max(result.current.bestCombo, c);
    setCombo(c);
    setFlash(ok ? 'goed' : 'fout');
    setTimeout(() => setFlash(null), 250);
    onAnswer(card, ok);
    setI((x) => x + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) pick(options[n - 1]!);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const score = result.current.answers.filter((a) => a.correct).length;
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <div className="flex items-center justify-between font-bold tabular-nums">
        <span className={cn('rounded-full px-3 py-1', left <= 10 ? 'bg-danger/15 text-danger' : 'bg-surface-2')}>⏱ {Math.max(0, left)} s</span>
        <span>Score: {score}</span>
        <motion.span key={combo} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="flex items-center gap-1 rounded-full bg-marker/60 px-3 py-1">
          <Zap size={16} aria-hidden="true" /> {combo}×
        </motion.span>
      </div>
      <div className={cn('rounded-[28px] border-2 bg-surface px-6 py-8 text-center shadow-soft transition-colors', flash === 'goed' ? 'border-primary' : flash === 'fout' ? 'border-danger' : 'border-line')}>
        <span className="text-[clamp(26px,7vw,40px)] font-extrabold" lang={card.promptLang}>{card.prompt}</span>
      </div>
      <ul className="grid gap-2">
        {options.map((o, n) => (
          <li key={`${i}-${o}`}>
            <button type="button" onClick={() => pick(o)} lang={card.answerLang} className="flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 text-left text-lg font-semibold hover:border-ink-soft">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface-2 text-sm text-ink-soft" aria-hidden="true">{n + 1}</span>
              {o}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
