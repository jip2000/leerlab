import type { LanguageCode } from '@/data/languages';
import { useSettings } from '@/lib/settings';
import { cn } from '@/lib/cn';
import { casesOf, selectedCases } from '../cases';

/** Een rij aan/uit-knoppen; minstens één blijft aan. Gebruikt voor naamvallen en onderdelen. */
export function ChoiceChips({ title, intro, label, items, on, onChange, className }: {
  title: string;
  intro: string;
  label: string;
  items: { id: string; top?: string; label: string; hint?: string }[];
  on: Set<string>;
  onChange: (ids: string[]) => void;
  className?: string;
}) {
  const toggle = (id: string) => {
    const next = on.has(id) ? [...on].filter((x) => x !== id) : [...on, id];
    if (next.length === 0) return;
    onChange(items.map((i) => i.id).filter((i) => next.includes(i)));
  };
  return (
    <section className={cn('rounded-[var(--radius-card)] border border-line bg-surface p-4', className)}>
      <h2 className="font-bold">{title}</h2>
      <p className="mb-3 text-sm text-ink-soft">{intro}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {items.map((c) => {
          const active = on.has(c.id);
          const last = active && on.size === 1;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              title={last ? 'Minstens één blijft aan' : undefined}
              onClick={() => toggle(c.id)}
              className={cn(
                'flex min-h-11 flex-col justify-center rounded-2xl border-2 px-3.5 py-1.5 text-left text-sm transition-colors',
                active ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line bg-surface text-ink-soft',
              )}
            >
              <span className="font-bold">{active ? '✓ ' : ''}{c.top ?? c.label}</span>
              {(c.top || c.hint) && <span className={cn('text-xs', !active && 'line-through')}>{c.top ? c.label : c.hint}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Kies welke naamvallen je leert (bijv. alleen de 3e en 4e). Standaard alles aan.
 * Geldt voor de hele taal: uitleg-tabellen en oefeningen passen zich aan.
 */
export function CaseChooser({ lang, className }: { lang: LanguageCode; className?: string }) {
  const saved = useSettings((s) => s.naamvallen);
  const update = useSettings((s) => s.update);
  const cases = casesOf(lang);
  if (cases.length === 0) return null;
  return (
    <ChoiceChips
      className={className}
      title="Welke naamvallen leer jij?"
      intro="Klik uit wat je niet hoeft te kennen. Uitleg en oefeningen passen zich aan."
      label="Naamvallen"
      items={cases.map((c) => ({ id: c.id, top: c.nr, label: c.label }))}
      on={selectedCases(lang, saved)}
      onChange={(ids) => update({ naamvallen: { ...saved, [lang]: ids } })}
    />
  );
}
