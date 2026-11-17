import type { LanguageCode } from '@/data/languages';
import { useSettings } from '@/lib/settings';
import { cn } from '@/lib/cn';
import { casesOf, selectedCases } from '../cases';

/**
 * Kies welke naamvallen je leert. Standaard alles aan; minstens één blijft aan.
 * Geldt voor de hele taal: uitleg-tabellen en oefeningen passen zich aan.
 */
export function CaseChooser({ lang, className }: { lang: LanguageCode; className?: string }) {
  const saved = useSettings((s) => s.naamvallen);
  const update = useSettings((s) => s.update);
  const cases = casesOf(lang);
  if (cases.length === 0) return null;
  const on = selectedCases(lang, saved);

  const toggle = (id: string) => {
    const next = on.has(id) ? [...on].filter((x) => x !== id) : [...on, id];
    if (next.length === 0) return;
    // Volgorde aanhouden zoals in de lijst.
    update({ naamvallen: { ...saved, [lang]: cases.map((c) => c.id).filter((c) => next.includes(c)) } });
  };

  return (
    <div className={cn('rounded-[var(--radius-card)] border border-line bg-surface p-4', className)}>
      <h2 className="font-bold">Welke naamvallen leer jij?</h2>
      <p className="mb-3 text-sm text-ink-soft">Zet uit wat je niet hoeft te kennen. Uitleg en oefeningen passen zich aan.</p>
      <div role="group" aria-label="Naamvallen" className="flex flex-wrap gap-2">
        {cases.map((c) => {
          const active = on.has(c.id);
          const last = active && on.size === 1;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              title={last ? 'Minstens één naamval blijft aan' : undefined}
              onClick={() => toggle(c.id)}
              className={cn(
                'min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors',
                active ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line bg-surface text-ink-soft line-through decoration-1',
              )}
            >
              {active ? '✓ ' : ''}{c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
