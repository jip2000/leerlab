import { useMemo, useState } from 'react';
import type { Card } from '../engine';
import { FlashcardView } from './FlashcardView';
import { ChoiceView } from './ChoiceView';
import { TypeView } from './TypeView';

/**
 * Leren-modus: elk woord doorloopt drie stappen: flashcard → meerkeuze → typen.
 * Een woord is "gekend" als je alle drie de stappen achter elkaar goed hebt.
 * Fout? Dan begint dat woord weer bij de flashcard. Je werkt met 5 woorden tegelijk.
 */
const BATCH = 5;

export interface LearnResult {
  missed: Set<string>;
}

export function LearnMode({ cards, onAnswer, onDone }: { cards: Card[]; onAnswer: (card: Card, correct: boolean) => void; onDone: (r: LearnResult) => void }) {
  const [stage, setStage] = useState<Record<string, number>>({});
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [missed] = useState(() => new Set<string>());
  const [turn, setTurn] = useState(0);

  // Actieve groep: de eerste 5 niet-gekende woorden.
  const active = useMemo(() => cards.filter((c) => !known.has(c.key)).slice(0, BATCH), [cards, known]);
  const card = active[turn % Math.max(1, active.length)];

  if (!card) return null;
  const s = stage[card.key] ?? 0;

  const answer = (ok: boolean) => {
    onAnswer(card, ok);
    if (!ok) missed.add(card.key);
    const nextStage = ok ? s + 1 : 0;
    if (nextStage >= 3) {
      const k = new Set(known).add(card.key);
      setKnown(k);
      if (k.size === cards.length) onDone({ missed });
    }
    setStage({ ...stage, [card.key]: nextStage });
    setTurn((t) => t + 1);
  };

  const labels = ['Stap 1: flashcard', 'Stap 2: meerkeuze', 'Stap 3: typen'];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-1 flex justify-between text-sm font-semibold text-ink-soft">
          <span>{labels[s]}</span>
          <span>{known.size} van {cards.length} gekend</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Gekend" aria-valuemin={0} aria-valuemax={cards.length} aria-valuenow={known.size}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(known.size / cards.length) * 100}%` }} />
        </div>
      </div>
      <div key={`${card.key}-${turn}`}>
        {s === 0 && <FlashcardView card={card} onAnswer={answer} />}
        {s === 1 && <ChoiceView card={card} pool={cards} onAnswer={(ok) => answer(ok)} />}
        {s === 2 && <TypeView card={card} test={false} onAnswer={(ok) => answer(ok)} />}
      </div>
    </div>
  );
}
