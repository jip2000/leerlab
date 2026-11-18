import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { LanguageCode } from '@/data/languages';
import { db } from '@/db/db';
import { verbEngines } from '@/features/verbs/registry';
import { useVerbStore } from '@/features/verbs/store';
import { candidates, loadStats, pickQuestions, type VerbMode } from '@/features/verbs/trainer';
import { cn } from '@/lib/cn';
import { SelectAll } from '@/components/ui/SelectAll';
import { hasLevels, levels } from '@/features/verbs/levels';

const modes: { id: VerbMode; label: string; text: string }[] = [
  { id: 'los', label: 'Eén vorm', text: 'Typ de goede vorm van het werkwoord' },
  { id: 'rijtje', label: 'Hele rijtje', text: 'Vul alle personen in' },
  { id: 'zin', label: 'In een zin', text: 'Vul het werkwoord in een zin in' },
  { id: 'omgekeerd', label: 'Herkennen', text: 'Welk werkwoord, tijd en persoon is dit?' },
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

/**
 * De werkwoordtrainer. Staat als tabblad "Werkwoorden" op de taalpagina bij Grammatica
 * (#/grammatica/fr?deel=werkwoorden); de taal komt uit de link.
 */
/** Eén genummerde stap, zodat je ziet wat je moet kiezen. */
function Step({ n, title, status, right, children }: { n: number; title: string; status?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2.5 text-lg font-bold">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm text-on-primary" aria-hidden="true">{n}</span>
          {title}
          {status && <span className="text-sm font-semibold text-ink-soft">({status})</span>}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
}

export function VerbsPage({ lang }: { lang: LanguageCode }) {
  const navigate = useNavigate();
  const s = useVerbStore();
  // Onthouden welke taal je het laatst trainde (voor #/werkwoorden en de oefenpagina).
  useEffect(() => {
    if (s.lang !== lang) s.set({ lang });
  }, [lang]);
  const engine = verbEngines[lang]!;
  const choice = s.choices[lang] ?? { verbs: [], tenses: [], persons: [0, 1, 2, 3, 4, 5] };
  const [search, setSearch] = useState('');
  const progress = useLiveQuery(() => db.verbProgress.where('lang').equals(lang).toArray(), [lang]);

  // Standaard staat alles aan: alle werkwoorden, alle tijden. Je vinkt zelf uit wat je niet wilt.
  useEffect(() => {
    if (choice.verbs.length === 0) s.setChoice(lang, { verbs: engine.verbs.map((v) => v.inf) });
    if (choice.tenses.length === 0) s.setChoice(lang, { tenses: engine.tenses.map((t) => t.id) });
  }, [lang]);

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
    const stats = await loadStats(lang);
    const questions = s.mode === 'rijtje'
      ? pickQuestions([...new Map(pool.map((q) => [`${q.verb}:${q.tense}`, { ...q, person: 0 }])).values()], Math.max(3, Math.round(s.count / 3)), stats, lang)
      : pickQuestions(pool, s.count, stats, lang);
    s.set({ questions, lang });
    navigate('/werkwoorden/oefenen');
  };

  const filtered = engine.verbs.filter((v) => !search || v.inf.includes(search.toLowerCase()) || v.nl.includes(search.toLowerCase()));

  const tenseNames = engine.tenses.filter((t) => choice.tenses.includes(t.id)).map((t) => t.label);
  const nQuestions = Math.min(pool.length, s.count);

  const verbStatus = choice.verbs.length === engine.verbs.length ? 'alle' : `${choice.verbs.length} van ${engine.verbs.length}`;
  const tenseStatus = choice.tenses.length === engine.tenses.length ? 'alle' : `${choice.tenses.length} van ${engine.tenses.length}`;
  const personStatus = choice.persons.length === 6 ? 'alle' : `${choice.persons.length} van 6`;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-ink-soft">Alles staat aan. Vink uit wat je <strong>niet</strong> wilt oefenen en druk op Start.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <Step
          n={1}
          title="Welke werkwoorden?"
          status={verbStatus}
          right={<SelectAll label={search ? 'gevonden werkwoorden' : 'werkwoorden'}
            allOn={filtered.every((v) => choice.verbs.includes(v.inf))}
            noneOn={choice.verbs.length === 0}
            onAll={() => s.setChoice(lang, { verbs: [...new Set([...choice.verbs, ...filtered.map((v) => v.inf)])] })}
            onNone={() => s.setChoice(lang, { verbs: [] })} />}
        >
          <div className="mb-3 flex flex-wrap gap-2">
            {engine.presets.map((p) => {
              const set = engine.verbs.filter(p.filter).map((v) => v.inf);
              const on = set.length > 0 && set.every((v) => choice.verbs.includes(v)) && choice.verbs.length === set.length;
              return (
                <Chip key={p.id} on={on} onClick={() => s.setChoice(lang, { verbs: set })}>
                  Alleen: {p.label.charAt(0).toLowerCase() + p.label.slice(1)}
                </Chip>
              );
            })}
          </div>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoek een werkwoord" aria-label="Zoek een werkwoord" />
          <ul className="mt-2 grid max-h-64 grid-cols-1 gap-1 overflow-y-auto rounded-xl border border-line bg-bg p-2 sm:grid-cols-2">
            {filtered.map((v) => (
              <li key={v.inf}>
                <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-surface-2">
                  <input type="checkbox" className="h-5 w-5 accent-[var(--primary)]" checked={choice.verbs.includes(v.inf)} onChange={() => s.setChoice(lang, { verbs: toggle(choice.verbs, v.inf) })} />
                  <span lang={lang} className="font-semibold">{v.inf}</span>
                  <span className="truncate text-sm text-ink-soft">{v.nl}</span>
                </label>
              </li>
            ))}
          </ul>
        </Step>

        <div className="flex flex-col gap-4">
          <Step
            n={2}
            title="Welke tijden?"
            status={tenseStatus}
            right={<SelectAll label="tijden" allOn={choice.tenses.length === engine.tenses.length} noneOn={choice.tenses.length === 0}
              onAll={() => s.setChoice(lang, { tenses: engine.tenses.map((t) => t.id) })} onNone={() => s.setChoice(lang, { tenses: [] })} />}
          >
            <div className="flex flex-wrap gap-2">
              {engine.tenses.map((t) => {
                const st = perTense.get(t.id);
                return (
                  <Chip key={t.id} on={choice.tenses.includes(t.id)} onClick={() => s.setChoice(lang, { tenses: toggle(choice.tenses, t.id) })}>
                    {t.label}
                    {st && st.total > 0 && <span className="ml-1.5 text-xs opacity-80">{Math.round((st.ok / st.total) * 100)}%</span>}
                  </Chip>
                );
              })}
            </div>
          </Step>

          <Step
            n={3}
            title="Wie?"
            status={personStatus}
            right={<SelectAll label="personen" allOn={choice.persons.length === 6} noneOn={choice.persons.length === 0}
              onAll={() => s.setChoice(lang, { persons: [0, 1, 2, 3, 4, 5] })} onNone={() => s.setChoice(lang, { persons: [] })} />}
          >
            <div className="flex flex-wrap gap-2">
              {engine.persons.map((p, i) => (
                <Chip key={p} on={choice.persons.includes(i)} onClick={() => s.setChoice(lang, { persons: toggle(choice.persons, i) })}>
                  {p}
                </Chip>
              ))}
            </div>
          </Step>
        </div>
      </div>

      <Step n={4} title="Hoe wil je oefenen?">
        <div role="radiogroup" aria-label="Oefenvorm" className="grid grid-cols-2 gap-2 lg:grid-cols-4">
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
        {s.mode === 'zin' && hasLevels(lang) && (
          <div className="mt-4">
            <h3 className="mb-2 font-bold">Hoe moeilijk?</h3>
            <div role="radiogroup" aria-label="Moeilijkheid" className="grid grid-cols-3 gap-2">
              {levels.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  role="radio"
                  aria-checked={s.level === l.id}
                  onClick={() => s.set({ level: l.id })}
                  className={cn('rounded-2xl border-2 p-3 text-left', s.level === l.id ? 'border-primary bg-primary-soft' : 'border-line bg-surface')}
                >
                  <span className="block font-bold">{'●'.repeat(l.id)}{'○'.repeat(3 - l.id)} {l.label}</span>
                  <span className="block text-sm text-ink-soft">{l.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <label className="mt-4 flex items-center gap-3 font-semibold">
          Aantal vragen
          <select value={s.count} onChange={(e) => s.set({ count: Number(e.target.value) })} className="h-11 rounded-[var(--radius-control)] border border-line bg-surface px-3">
            {[10, 15, 20, 30, 50].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </Step>

      <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+80px)] z-10 rounded-[var(--radius-card)] border border-line bg-surface/95 p-3 pr-[76px] shadow-soft backdrop-blur lg:bottom-4 lg:pr-3">
        {pool.length === 0 ? (
          <p role="alert" className="mb-2 text-sm font-semibold text-danger">Kies minstens één werkwoord, tijd en persoon.</p>
        ) : (
          <p className="mb-2 text-sm text-ink-soft">
            {s.mode === 'rijtje' ? 'Rijtjes' : `${nQuestions} vragen`} · {verbStatus} werkwoorden · {tenseNames.length === engine.tenses.length ? 'alle tijden' : tenseNames.slice(0, 2).join(', ') + (tenseNames.length > 2 ? ` +${tenseNames.length - 2}` : '')}
            {s.mode !== 'rijtje' && pool.length < s.count && <span className="block">Met deze keuze zijn er {pool.length} verschillende vragen. Je krijgt ze allemaal één keer.</span>}
          </p>
        )}
        <Button size="lg" className="w-full justify-center" disabled={pool.length === 0} onClick={() => void start()} icon={<Play size={20} aria-hidden="true" />}>
          Start
        </Button>
      </div>

      {hardest.length > 0 && (
        <div className="rounded-[var(--radius-card)] bg-surface-2 p-4">
          <h2 className="mb-1 font-bold">Hier ging het vaakst mis</h2>
          <ul className="text-sm">
            {hardest.map(([verb, n]) => (
              <li key={verb}>
                <span lang={lang} className="font-semibold">{verb}</span>: {n}× fout
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
