import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sounds';
import { shuffled, type Card } from '../engine';
import { shownAnswer } from '../choices';

const PER_ROUND = 6;
interface Tile { id: string; key: string; text: string; lang: string }

/** Koppelen: tik een woord en daarna de vertaling. Steeds 6 paren tegelijk. */
export function MatchGame({ cards, onPair, onDone }: { cards: Card[]; onPair: (key: string, correct: boolean) => void; onDone: (seconds: number) => void }) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<Tile | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<string[]>([]);
  const [mistakes] = useState(() => new Set<string>());
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const roundCards = cards.slice(round * PER_ROUND, (round + 1) * PER_ROUND);
  const tiles = useMemo<Tile[]>(
    () =>
      shuffled(roundCards.flatMap((c) => [
        { id: `${c.key}:q`, key: c.key, text: c.prompt, lang: c.promptLang },
        { id: `${c.key}:a`, key: c.key, text: shownAnswer(c), lang: c.answerLang },
      ])),
    [round],
  );

  const tap = (t: Tile) => {
    if (matched.has(t.key)) return;
    if (!selected) return setSelected(t);
    if (selected.id === t.id) return setSelected(null);
    if (selected.key === t.key) {
      play('goed');
      const next = new Set(matched).add(t.key);
      setMatched(next);
      setSelected(null);
      onPair(t.key, !mistakes.has(t.key));
      if (roundCards.every((c) => next.has(c.key))) {
        if ((round + 1) * PER_ROUND >= cards.length) setTimeout(() => onDone(Math.round((Date.now() - start) / 1000)), 400);
        else setTimeout(() => setRound((r) => r + 1), 400);
      }
    } else {
      play('fout');
      mistakes.add(selected.key);
      mistakes.add(t.key);
      setWrongFlash([selected.id, t.id]);
      setSelected(null);
      setTimeout(() => setWrongFlash([]), 450);
    }
  };

  const seconds = Math.floor((now - start) / 1000);
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center justify-center gap-2 text-lg font-bold tabular-nums" aria-live="off">
        <Timer size={20} aria-hidden="true" /> {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tiles.map((t) => {
          const done = matched.has(t.key);
          const wrong = wrongFlash.includes(t.id);
          return (
            <li key={t.id}>
              <motion.button
                type="button"
                onClick={() => tap(t)}
                disabled={done}
                aria-pressed={selected?.id === t.id}
                animate={wrong ? { x: [0, -6, 6, -3, 3, 0] } : done ? { opacity: 0.25, scale: 0.96 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                lang={t.lang}
                className={cn(
                  'min-h-20 w-full rounded-2xl border-2 p-3 text-center font-semibold break-words',
                  selected?.id === t.id ? 'border-primary bg-primary-soft' : wrong ? 'border-danger bg-danger/10' : done ? 'border-transparent bg-primary-soft' : 'border-line bg-surface hover:border-ink-soft',
                )}
              >
                {t.text}
              </motion.button>
            </li>
          );
        })}
      </ul>
      <p className="text-center text-sm text-ink-soft">
        Ronde {round + 1} van {Math.ceil(cards.length / PER_ROUND)}
      </p>
    </div>
  );
}
