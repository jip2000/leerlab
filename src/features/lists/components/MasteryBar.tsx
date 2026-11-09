import { useLiveQuery } from 'dexie-react-hooks';
import { boxesForList } from '@/features/srs/repo';
import { mastery } from '@/features/srs/leitner';

/** Groen = gekend, oranje = bijna, grijs = nog leren. Met tekst, dus niet alleen kleur. */
export function MasteryBar({ listId, total, showText = false }: { listId: string; total: number; showText?: boolean }) {
  const boxes = useLiveQuery(() => boxesForList(listId), [listId]);
  if (!boxes || total === 0) return null;
  const m = mastery([...boxes.values()], total);
  const pct = (n: number) => `${(n / total) * 100}%`;
  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-surface-2"
        role="img"
        aria-label={`${m.known} gekend, ${m.almost} bijna, ${m.learning} nog leren`}
      >
        <div className="h-full bg-primary" style={{ width: pct(m.known) }} />
        <div className="h-full bg-[#E5891A]" style={{ width: pct(m.almost) }} />
      </div>
      {showText && (
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-primary-ink">{m.known} gekend</span>, <span className="font-semibold text-[#AD5C08] dark:text-[#F0A54A]">{m.almost} bijna</span>, {m.learning} nog leren
        </p>
      )}
    </div>
  );
}
