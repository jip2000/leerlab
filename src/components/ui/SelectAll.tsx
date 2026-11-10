import { CheckCheck, X } from 'lucide-react';

/**
 * Twee knoppen naast een kopje: alles in één keer aanvinken, of alles uit.
 * `label` zegt waarover het gaat, voor schermlezers ("werkwoorden", "tijden"…).
 */
export function SelectAll({ label, onAll, onNone, allOn, noneOn }: { label: string; onAll: () => void; onNone: () => void; allOn: boolean; noneOn: boolean }) {
  const cls = 'inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold disabled:opacity-40';
  return (
    <div className="flex gap-1.5">
      <button type="button" onClick={onAll} disabled={allOn} aria-label={`Alle ${label} aanvinken`} className={`${cls} border-primary bg-primary-soft text-primary-ink`}>
        <CheckCheck size={16} aria-hidden="true" /> Alles aanvinken
      </button>
      <button type="button" onClick={onNone} disabled={noneOn} aria-label={`Alle ${label} uitvinken`} className={`${cls} border-line text-ink-soft`}>
        <X size={16} aria-hidden="true" /> Niets
      </button>
    </div>
  );
}
