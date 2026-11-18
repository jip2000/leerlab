import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SelectAll } from '@/components/ui/SelectAll';
import type { LanguageCode } from '@/data/languages';
import { getTopic } from '@/data/grammar';
import { db } from '@/db/db';
import { topicUsesCases } from '@/features/grammar/cases';
import { CaseChooser } from '@/features/grammar/components/CaseChooser';
import { PartChooser } from '@/features/grammar/components/PartChooser';
import { practiceTopics, tenseUse, validTopic, WERKWOORDEN } from '@/features/grammar/mix';
import { prepareMix } from '@/features/grammar/startMix';
import { templatesFor } from '@/features/grammar/templates';
import { tenseExplanations } from '@/features/grammar/tenseLinks';
import { hasLevels, levels } from '@/features/verbs/levels';
import { verbEngines } from '@/features/verbs/registry';
import { useVerbStore } from '@/features/verbs/store';
import { candidates, loadStats, pickQuestions, type VerbMode } from '@/features/verbs/trainer';
import { cn } from '@/lib/cn';
import { toast } from '@/lib/toast';

const modes: { id: VerbMode; label: string; text: string }[] = [
  { id: 'los', label: 'Eén vorm', text: 'Typ de goede vorm van het werkwoord' },
  { id: 'rijtje', label: 'Hele rijtje', text: 'Vul alle personen in' },
  { id: 'zin', label: 'In een zin', text: 'Vul het werkwoord in een zin in' },
  { id: 'omgekeerd', label: 'Herkennen', text: 'Welk werkwoord, tijd en persoon is dit?' },
];

const PRESET_COUNTS = [10, 15, 20, 30, 50];

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

/** Kaartje om aan/uit te zetten, met een regel eronder (status + uitleg-link). */
function ToggleCard({ on, onClick, title, sub, link, lang }: { on: boolean; onClick: () => void; title: string; sub: string; link?: string; lang?: string }) {
  return (
    <li className={cn('flex flex-col rounded-2xl border-2 transition-colors', on ? 'border-primary bg-primary-soft' : 'border-line bg-surface')}>
      <button type="button" aria-pressed={on} onClick={onClick} className="flex min-h-12 items-start gap-2 px-3 pt-3 pb-1 text-left">
        <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 text-xs font-bold', on ? 'border-primary bg-primary text-on-primary' : 'border-line')} aria-hidden="true">
          {on ? '✓' : ''}
        </span>
        <span lang={lang} className="font-bold">{title}</span>
      </button>
      <span className="flex items-center justify-between gap-2 px-3 pb-2 pl-10 text-xs">
        <span className="text-ink-soft">{sub}</span>
        {link && <Link to={link} className="font-semibold text-primary-ink underline underline-offset-2">uitleg</Link>}
      </span>
    </li>
  );
}

/** Aantal vragen: vaste keuzes, of zelf een getal invullen. */
function QuestionCount({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [own, setOwn] = useState(!PRESET_COUNTS.includes(value));
  const [text, setText] = useState(String(value));
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-3 font-semibold">
        Aantal vragen
        <select
          value={own ? 'eigen' : String(value)}
          onChange={(e) => {
            if (e.target.value === 'eigen') {
              setOwn(true);
              setText(String(value));
            } else {
              setOwn(false);
              onChange(Number(e.target.value));
            }
          }}
          className="h-11 rounded-[var(--radius-control)] border border-line bg-surface px-3"
        >
          {PRESET_COUNTS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
          <option value="eigen">Zelf invullen…</option>
        </select>
      </label>
      {own && (
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={200}
            autoFocus
            aria-label="Eigen aantal vragen"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              const n = Math.round(Number(e.target.value));
              if (e.target.value !== '' && n >= 1) onChange(Math.min(200, n));
            }}
            onBlur={() => setText(String(value))}
            className="h-11 w-24 rounded-[var(--radius-control)] border border-line bg-surface px-3"
          />
          <span className="text-sm font-normal text-ink-soft">(1 tot 200)</span>
        </label>
      )}
    </div>
  );
}

/**
 * Oefenen op de taalpagina, in deze volgorde:
 * ① wat (werkwoorden vervoegen en/of grammatica-onderwerpen), ② in welke tijden,
 * ③ welke werkwoorden, ④ wie, ⑤ hoe. Dan Start.
 */
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
  const topicScores = useLiveQuery(() => db.grammarProgress.where('lang').equals(lang).toArray(), [lang]);

  // Alle werkwoorden staan standaard aan. Wát je oefent en de tijd(en) kies je zelf.
  useEffect(() => {
    if (choice.verbs.length === 0) s.setChoice(lang, { verbs: engine.verbs.map((v) => v.inf) });
  }, [lang]);
  const uitleg = useMemo(() => new Map([...tenseExplanations(lang)].map(([tense, topic]) => [tense, `/grammatica/${lang}/${topic}`])), [lang]);
  const topics = useMemo(() => practiceTopics(lang), [lang]);

  const toggle = <T,>(list: T[], x: T) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
  const chosen = (choice.topics ?? []).filter((id) => validTopic(lang, id));
  const withVerbs = chosen.includes(WERKWOORDEN);
  const tenseTopics = chosen.filter((id) => tenseUse(lang, id) !== 'geen');
  const needsTenses = tenseTopics.length > 0;
  const showModes = chosen.some((id) => tenseUse(lang, id) === 'werkwoorden' || tenseUse(lang, id) === 'werkwoordgroep');
  const titleOf = (id: string) => topics.find((t) => t.id === id)?.title ?? id;
  const usesCases = chosen.some((id) => {
    const t = getTopic(lang, id);
    return (t && topicUsesCases(lang, t)) || templatesFor(lang, id).some((x) => x.cases?.length);
  });
  const withParts = chosen.map((id) => getTopic(lang, id)).filter((t) => t?.parts?.length);

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
  const topicScore = new Map((topicScores ?? []).map((p) => [p.topicId, p.score]));

  const start = async () => {
    // Alleen werkwoorden vervoegen: de werkwoordtrainer (met herhalen van fouten).
    if (chosen.length === 1 && withVerbs) {
      const stats = await loadStats(lang);
      const questions = s.mode === 'rijtje'
        ? pickQuestions([...new Map(pool.map((q) => [`${q.verb}:${q.tense}`, { ...q, person: 0 }])).values()], Math.max(3, Math.round(s.count / 3)), stats, lang)
        : pickQuestions(pool, s.count, stats, lang);
      s.set({ questions, lang });
      navigate('/werkwoorden/oefenen');
      return;
    }
    const mix = await prepareMix(lang);
    if (mix.length === 0) return toast('Met deze keuze zijn er geen oefeningen. Kies nog iets anders aan.');
    s.set({ mix, lang });
    navigate(`/grammatica/${lang}/oefenen`);
  };

  const filtered = engine.verbs.filter((v) => !search || v.inf.includes(search.toLowerCase()) || v.nl.includes(search.toLowerCase()));
  const tenseNames = engine.tenses.filter((t) => choice.tenses.includes(t.id)).map((t) => t.label);
  const verbStatus = choice.verbs.length === engine.verbs.length ? 'alle' : `${choice.verbs.length} van ${engine.verbs.length}`;
  const personStatus = choice.persons.length === 6 ? 'alle' : `${choice.persons.length} van 6`;

  let problem: string | null = null;
  if (needsTenses && choice.tenses.length === 0) problem = 'Kies minstens één tijd.';
  else if (withVerbs && pool.length === 0) problem = 'Kies minstens één werkwoord en persoon.';
  let n = 1;

  return (
    <div className="flex flex-col gap-4">
      <Step
        n={n++}
        title="Wat wil je oefenen?"
        status={chosen.length ? `${chosen.length} gekozen` : 'klik er één of meer aan'}
        right={<SelectAll label="onderwerpen" allOn={chosen.length === topics.length} noneOn={chosen.length === 0}
          onAll={() => s.setChoice(lang, { topics: topics.map((t) => t.id) })} onNone={() => s.setChoice(lang, { topics: [] })} />}
      >
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {topics.map((t) => {
            const score = topicScore.get(t.id);
            return (
              <ToggleCard
                key={t.id}
                on={chosen.includes(t.id)}
                onClick={() => s.setChoice(lang, { topics: toggle(chosen, t.id) })}
                title={t.title}
                sub={t.id === WERKWOORDEN ? 'rijtjes en zinnen' : score === undefined ? 'nieuw' : `${score}% goed`}
                link={t.id === WERKWOORDEN ? undefined : `/grammatica/${lang}/${t.id}`}
              />
            );
          })}
        </ul>
        {(withParts.length > 0 || usesCases) && (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {withParts.map((t) => (
              <div key={t!.id}>
                <p className="mb-1 text-sm font-semibold text-ink-soft">{titleOf(t!.id)}</p>
                <PartChooser lang={lang} topic={t!} />
              </div>
            ))}
            {usesCases && <CaseChooser lang={lang} />}
          </div>
        )}
      </Step>

      {chosen.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-dashed border-line p-4 text-center text-ink-soft">
          👆 Klik hierboven aan wat je wilt oefenen. Daarna kies je de tijden en hoe je wilt oefenen.
        </p>
      ) : (
        <>
          {needsTenses ? (
            <Step
              n={n++}
              title="In welke tijden?"
              status={choice.tenses.length ? `${choice.tenses.length} gekozen` : 'klik er één of meer aan'}
              right={<SelectAll label="tijden" allOn={choice.tenses.length === engine.tenses.length} noneOn={choice.tenses.length === 0}
                onAll={() => s.setChoice(lang, { tenses: engine.tenses.map((t) => t.id) })} onNone={() => s.setChoice(lang, { tenses: [] })} />}
            >
              <p className="mb-3 text-sm text-ink-soft">Geldt voor: {tenseTopics.map(titleOf).join(', ')}.</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {engine.tenses.map((t) => {
                  const st = perTense.get(t.id);
                  const pct = st && st.total > 0 ? Math.round((st.ok / st.total) * 100) : undefined;
                  return (
                    <ToggleCard
                      key={t.id}
                      lang={lang}
                      on={choice.tenses.includes(t.id)}
                      onClick={() => s.setChoice(lang, { tenses: toggle(choice.tenses, t.id) })}
                      title={t.label}
                      sub={pct === undefined ? 'nieuw' : `${pct}% goed`}
                      link={uitleg.get(t.id)}
                    />
                  );
                })}
              </ul>
            </Step>
          ) : (
            <p className="rounded-[var(--radius-card)] bg-surface-2 p-4 text-sm text-ink-soft">
              Wat je gekozen hebt, oefen je los van de tijd. Je hoeft dus geen tijd te kiezen.
            </p>
          )}

          {withVerbs && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Step
                n={n++}
                title="Welke werkwoorden?"
                status={verbStatus}
                right={<SelectAll label={search ? 'gevonden werkwoorden' : 'werkwoorden'}
                  allOn={filtered.every((v) => choice.verbs.includes(v.inf))}
                  noneOn={choice.verbs.length === 0}
                  onAll={() => s.setChoice(lang, { verbs: [...new Set([...choice.verbs, ...filtered.map((v) => v.inf)])] })}
                  onNone={() => s.setChoice(lang, { verbs: [] })} />}
              >
                {engine.presets.length > 0 && (
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
                )}
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

              <Step
                n={n++}
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
          )}

          <Step n={n++} title="Hoe wil je oefenen?">
            {showModes && (
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
            )}
            {showModes && s.mode === 'zin' && hasLevels(lang) && (
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
            <QuestionCount value={s.count} onChange={(count) => s.set({ count })} />
          </Step>

          <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+80px)] z-10 rounded-[var(--radius-card)] border border-line bg-surface/95 p-3 pr-[76px] shadow-soft backdrop-blur lg:bottom-4 lg:pr-3">
            {problem ? (
              <p role="alert" className="mb-2 text-sm font-semibold text-danger">{problem}</p>
            ) : (
              <p className="mb-2 text-sm text-ink-soft">
                {s.count} vragen · {chosen.map(titleOf).slice(0, 3).join(' + ')}{chosen.length > 3 ? ` +${chosen.length - 3}` : ''}
                {needsTenses && <> · <span lang={lang}>{tenseNames.slice(0, 3).join(' + ')}{tenseNames.length > 3 ? ` +${tenseNames.length - 3}` : ''}</span></>}
                {withVerbs && chosen.length === 1 && s.mode !== 'rijtje' && pool.length < s.count && (
                  <span className="block">Met deze keuze zijn er {pool.length} verschillende vragen. Je krijgt ze allemaal één keer.</span>
                )}
              </p>
            )}
            <Button size="lg" className="w-full justify-center" disabled={!!problem} onClick={() => void start()} icon={<Play size={20} aria-hidden="true" />}>
              Start
            </Button>
          </div>
        </>
      )}

      {hardest.length > 0 && (
        <div className="rounded-[var(--radius-card)] bg-surface-2 p-4">
          <h2 className="mb-1 font-bold">Hier ging het vaakst mis</h2>
          <ul className="text-sm">
            {hardest.map(([verb, cnt]) => (
              <li key={verb}>
                <span lang={lang} className="font-semibold">{verb}</span>: {cnt}× fout
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
