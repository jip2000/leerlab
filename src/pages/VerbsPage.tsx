import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { Play } from 'lucide-react';
import { GrammarHeader } from '@/features/grammar/components/GrammarHeader';
import { PlusGate } from '@/features/account/PlusGate';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getLanguage } from '@/data/languages';
import { db } from '@/db/db';
import { verbEngines, verbLanguages } from '@/features/verbs/registry';
import { useVerbStore } from '@/features/verbs/store';
import { candidates, loadStats, pickQuestions, type VerbMode } from '@/features/verbs/trainer';
import { cn } from '@/lib/cn';
import { SelectAll } from '@/components/ui/SelectAll';

const modes: { id: VerbMode; label: string; text: string }[] = [
  { id: 'los', label: 'Los', text: 'aller · passé composé · nous → typ de vorm' },
  { id: 'rijtje', label: 'Rijtje', text: 'Het hele rijtje invullen' },
  { id: 'zin', label: 'In een zin', text: 'Vul het werkwoord in een zin in' },
  { id: 'omgekeerd', label: 'Omgekeerd', text: 'Je ziet een vorm: welk werkwoord, tijd en persoon?' },
];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn('min-h-11 rounded-full border px-3.5 text-sm font-semibold', on ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line bg-surface text-ink-soft')}
    >
      {children}
    </button>
  );
}

/** Tabblad "Werkwoorden" van Grammatica. De tabbladen blijven staan, ook als de trainer bij Plus hoort. */
export function VerbsPage() {
  return (
    <>
      <GrammarHeader intro="Kies een taal, werkwoorden, tijden en hoe je wilt oefenen." />
      <PlusGate feature="werkwoorden">
        <VerbSetup />
      </PlusGate>
    </>
  );
}

function VerbSetup() {
  const navigate = useNavigate();
  const s = useVerbStore();
  const engine = verbEngines[s.lang]!;
  const choice = s.choices[s.lang] ?? { verbs: [], tenses: [], persons: [0, 1, 2, 3, 4, 5] };
  const [search, setSearch] = useState('');
  const progress = useLiveQuery(() => db.verbProgress.where('lang').equals(s.lang).toArray(), [s.lang]);

  // Standaardkeuze als er nog niets gekozen is: de eerste set en de eerste tijd.
  useEffect(() => {
    if (choice.verbs.length === 0) s.setChoice(s.lang, { verbs: engine.verbs.filter(engine.presets[0]!.filter).slice(0, 10).map((v) => v.inf) });
    if (choice.tenses.length === 0) s.setChoice(s.lang, { tenses: [engine.tenses[0]!.id] });
  }, [s.lang]);

  const toggle = <T,>(list: T[], x: T) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
  const pool = useMemo(() => candidates(engine, choice.verbs, choice.tenses, choice.persons), [engine, choice]);

  const perTense = useMemo(() => {
    const m = new Map<string, { ok: number; total: number }>();
    for (const p of progress ?? []) {
      const e = m.get(p.tense) ?? { ok: 0, total: 0 };
      m.set(p.tense, { ok: e.ok + p.correctCount, total: e.total + p.correctCount + p.wrongCount });
    }
    return m;
  }, [progress]);
  const hardest = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of progress ?? []) m.set(p.verb, (m.get(p.verb) ?? 0) + p.wrongCount);
    return [...m.entries()].filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [progress]);

  const start = async () => {
    const stats = await loadStats(s.lang);
    const questions = s.mode === 'rijtje'
      ? pickQuestions([...new Map(pool.map((q) => [`${q.verb}:${q.tense}`, { ...q, person: 0 }])).values()], Math.max(3, Math.round(s.count / 3)), stats, s.lang)
      : pickQuestions(pool, s.count, stats, s.lang);
    s.set({ questions });
    navigate('/werkwoorden/oefenen');
  };

  const filtered = engine.verbs.filter((v) => !search || v.inf.includes(search.toLowerCase()) || v.nl.includes(search.toLowerCase()));

  return (
    <>
      <div role="tablist" aria-label="Taal" className="mb-5 flex flex-wrap gap-2">
        {verbLanguages.map((code) => (
          <button
            key={code}
            role="tab"
            type="button"
            aria-selected={s.lang === code}
            onClick={() => s.set({ lang: code })}
            className={cn('h-11 rounded-full border px-4 font-semibold', s.lang === code ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line bg-surface text-ink-soft')}
          >
            {getLanguage(code).flag} {getLanguage(code).name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Werkwoorden ({choice.verbs.length})</h2>
            <SelectAll
              label={search ? 'gevonden werkwoorden' : 'werkwoorden'}
              allOn={filtered.every((v) => choice.verbs.includes(v.inf))}
              noneOn={choice.verbs.length === 0}
              onAll={() => s.setChoice(s.lang, { verbs: [...new Set([...choice.verbs, ...filtered.map((v) => v.inf)])] })}
              onNone={() => s.setChoice(s.lang, { verbs: [] })}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {engine.presets.map((p) => {
              const set = engine.verbs.filter(p.filter).map((v) => v.inf);
              const on = set.length > 0 && set.every((v) => choice.verbs.includes(v)) && choice.verbs.length === set.length;
              return (
                <Chip key={p.id} on={on} onClick={() => s.setChoice(s.lang, { verbs: set })}>
                  {p.label}
                </Chip>
              );
            })}
          </div>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoek een werkwoord" aria-label="Zoek een werkwoord" />
          <ul className="grid max-h-80 grid-cols-1 gap-1 overflow-y-auto rounded-[var(--radius-card)] border border-line bg-surface p-2 sm:grid-cols-2">
            {filtered.map((v) => (
              <li key={v.inf}>
                <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-surface-2">
                  <input type="checkbox" className="h-5 w-5 accent-[var(--primary)]" checked={choice.verbs.includes(v.inf)} onChange={() => s.setChoice(s.lang, { verbs: toggle(choice.verbs, v.inf) })} />
                  <span lang={s.lang} className="font-semibold">{v.inf}</span>
                  <span className="truncate text-sm text-ink-soft">{v.nl}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Tijden</h2>
              <SelectAll label="tijden" allOn={choice.tenses.length === engine.tenses.length} noneOn={choice.tenses.length === 0}
                onAll={() => s.setChoice(s.lang, { tenses: engine.tenses.map((t) => t.id) })} onNone={() => s.setChoice(s.lang, { tenses: [] })} />
            </div>
            <div className="flex flex-wrap gap-2">
              {engine.tenses.map((t) => {
                const st = perTense.get(t.id);
                return (
                  <Chip key={t.id} on={choice.tenses.includes(t.id)} onClick={() => s.setChoice(s.lang, { tenses: toggle(choice.tenses, t.id) })}>
                    {t.label}
                    {st && st.total > 0 && <span className="ml-1.5 text-xs opacity-80">{Math.round((st.ok / st.total) * 100)}%</span>}
                  </Chip>
                );
              })}
            </div>
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Personen</h2>
              <SelectAll label="personen" allOn={choice.persons.length === 6} noneOn={choice.persons.length === 0}
                onAll={() => s.setChoice(s.lang, { persons: [0, 1, 2, 3, 4, 5] })} onNone={() => s.setChoice(s.lang, { persons: [] })} />
            </div>
            <div className="flex flex-wrap gap-2">
              {engine.persons.map((p, i) => (
                <Chip key={p} on={choice.persons.includes(i)} onClick={() => s.setChoice(s.lang, { persons: toggle(choice.persons, i) })}>
                  {p}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-bold">Oefenvorm</h2>
            <div role="radiogroup" aria-label="Oefenvorm" className="grid grid-cols-2 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={s.mode === m.id}
                  onClick={() => s.set({ mode: m.id })}
                  className={cn('rounded-2xl border-2 p-3 text-left', s.mode === m.id ? 'border-primary bg-primary-soft' : 'border-line bg-surface')}
                >
                  <span className="block font-bold">{m.label}</span>
                  <span className="block text-sm text-ink-soft">{m.text}</span>
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 font-semibold">
            Aantal vragen
            <select value={s.count} onChange={(e) => s.set({ count: Number(e.target.value) })} className="h-11 rounded-[var(--radius-control)] border border-line bg-surface px-3">
              {[10, 15, 20, 30, 50].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <Button size="lg" disabled={pool.length === 0} onClick={() => void start()} icon={<Play size={20} aria-hidden="true" />}>
            Start
          </Button>
          {pool.length === 0 && <p role="alert" className="text-sm font-semibold text-danger">Kies minstens één werkwoord, tijd en persoon.</p>}

          {hardest.length > 0 && (
            <div className="rounded-[var(--radius-card)] bg-surface-2 p-4">
              <h2 className="mb-1 font-bold">Hier ging het vaakst mis</h2>
              <ul className="text-sm">
                {hardest.map(([verb, n]) => (
                  <li key={verb}>
                    <span lang={s.lang} className="font-semibold">{verb}</span>: {n}× fout
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
