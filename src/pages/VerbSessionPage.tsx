import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { CharBar } from '@/components/ui/CharBar';
import { Select } from '@/components/ui/Field';
import { db, newId } from '@/db/db';
import { verbEngines } from '@/features/verbs/registry';
import { useVerbStore } from '@/features/verbs/store';
import { recordVerb, type VerbQuestion } from '@/features/verbs/trainer';
import { AnswerDiff, Verdict } from '@/features/practice/components/Feedback';
import { finishRewards, getProfile, recordAnswer, type Profile, type Rewards } from '@/features/progress/repo';
import { XP_FINISH } from '@/features/progress/xp';
import { checkAnswer } from '@/lib/check';
import { celebrate } from '@/lib/confetti';
import { insertAtCursor } from '@/lib/insert';
import { useSettings, type CheckRules } from '@/lib/settings';
import type { VerbEngine } from '@/features/verbs/types';
import type { LanguageCode } from '@/data/languages';
import { play } from '@/lib/sounds';
import { cn } from '@/lib/cn';
import { updateAppBadge } from '@/lib/appBadge';

const XP_VERB = 10;

export function VerbSessionPage() {
  const navigate = useNavigate();
  const { lang, mode, questions: initial } = useVerbStore();
  const engine = verbEngines[lang]!;
  const rules = useSettings((s) => s.nakijkregels);
  const dagdoel = useSettings((s) => s.dagdoel);
  const [queue, setQueue] = useState<VerbQuestion[]>(initial);
  const [done, setDone] = useState(0);
  const [results, setResults] = useState<{ q: VerbQuestion; correct: boolean }[]>([]);
  const [rewards, setRewards] = useState<Rewards | undefined>();
  const before = useRef<Profile | null>(null);
  const last = useRef(Date.now());
  const total = initial.length;
  const ctx: Ctx = { engine, lang, rules, initial };

  useEffect(() => {
    if (initial.length === 0) navigate('/werkwoorden', { replace: true });
    void getProfile().then((p) => (before.current = p));
  }, []);

  const q = queue[0];
  const finished = !q && total > 0;

  const answer = async (correct: boolean, retry = true) => {
    if (!q) return;
    const now = Date.now();
    await recordAnswer({ correct, xp: correct ? XP_VERB : 1, seconds: Math.min(now - last.current, 60_000) / 1000 });
    last.current = now;
    const first = !results.some((r) => r.q === q);
    if (first) await recordVerb(lang, q, correct);
    setResults((r) => (first ? [...r, { q, correct }] : r));
    // Fout (behalve bij "rijtje"): komt nog één keer terug aan het eind.
    setQueue((qs) => [...qs.slice(1), ...(!correct && retry && first ? [q] : [])]);
    if (first) setDone((d) => d + 1);
  };

  useEffect(() => {
    if (!finished || rewards) return;
    void (async () => {
      const ok = results.filter((r) => r.correct).length;
      const pct = total ? Math.round((ok / total) * 100) : 0;
      await db.sessions.add({ id: newId(), type: `werkwoorden-${lang}`, listIds: [], startedAt: Date.now(), endedAt: Date.now(), score: pct, answers: [] });
      const r = await finishRewards(before.current ?? (await getProfile()), { mode: 'werkwoorden', total, percentage: pct }, XP_FINISH, dagdoel);
      setRewards(r);
      void updateAppBadge(r.streakAfter);
      play(pct === 100 || r.badges.length ? 'beloning' : 'klaar');
      if (pct === 100 || r.badges.length) celebrate(pct === 100);
    })();
  }, [finished]);

  if (finished) {
    const ok = results.filter((r) => r.correct).length;
    const wrong = results.filter((r) => !r.correct);
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-5">
        <div className="rounded-[28px] border border-line bg-surface p-8 text-center shadow-soft">
          <p className="text-[56px] leading-none font-extrabold"><span className="marker">{ok}/{total}</span></p>
          <p className="mt-2 text-lg font-bold">{ok === total ? 'Foutloos!' : ok / total >= 0.7 ? 'Lekker bezig!' : 'Goed geoefend. Nog een rondje?'}</p>
          {rewards && <p className="mt-1 text-ink-soft">{rewards.streakAfter} {rewards.streakAfter === 1 ? 'dag' : 'dagen'} op rij{rewards.badges.length ? `, nieuwe badge: ${rewards.badges.map((b) => `${b.emoji} ${b.title}`).join(', ')}` : ''}</p>}
        </div>
        {wrong.length > 0 && (
          <section>
            <h2 className="mb-2 font-bold">Deze had je fout</h2>
            <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
              {wrong.map(({ q: w }, i) => (
                <li key={i} className="px-4 py-2.5">
                  <span className="text-sm text-ink-soft">{w.verb} · {engine.tenses.find((t) => t.id === w.tense)?.label}</span>
                  <span className="block font-semibold" lang={lang}>
                    {mode === 'rijtje' ? engine.conjugate(w.verb, w.tense).filter(Boolean).join(', ') : engine.conjugate(w.verb, w.tense)[w.person]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <Button size="lg" className="justify-center" onClick={() => navigate('/werkwoorden')}>Nog een keer</Button>
        <ButtonLink to="/" variant="secondary" className="h-13 justify-center">Klaar</ButtonLink>
      </div>
    );
  }
  if (!q) return null;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/werkwoorden')} aria-label="Stoppen" className="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-2">
          <X size={22} />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Voortgang" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(done / total) * 100}%` }} />
        </div>
        <span className="w-14 text-right text-sm font-semibold text-ink-soft tabular-nums">{done}/{total}</span>
      </div>
      {mode === 'rijtje' ? (
        <RowExercise ctx={ctx} key={`${q.verb}-${q.tense}-${done}-${queue.length}`} q={q} onDone={(ok) => void answer(ok, false)} />
      ) : mode === 'omgekeerd' ? (
        <ReverseExercise ctx={ctx} key={`${q.verb}-${q.tense}-${q.person}-${done}-${queue.length}`} q={q} onDone={(ok) => void answer(ok)} />
      ) : (
        <SingleExercise ctx={ctx} key={`${q.verb}-${q.tense}-${q.person}-${done}-${queue.length}`} q={q} sentence={mode === 'zin'} onDone={(ok) => void answer(ok)} />
      )}
    </div>
  );
}

interface Ctx {
  engine: VerbEngine;
  lang: LanguageCode;
  rules: CheckRules;
  initial: VerbQuestion[];
}

/** Oefenvorm A (los) en C (in een zin). */
function SingleExercise({ ctx, q, sentence, onDone }: { ctx: Ctx; q: VerbQuestion; sentence: boolean; onDone: (ok: boolean) => void }) {
  const { engine, lang, rules } = ctx;
  const [value, setValue] = useState('');
  const [result, setResult] = useState<null | { ok: boolean; expected: string }>(null);
  const input = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const tense = engine.tenses.find((t) => t.id === q.tense)!;
  const s = sentence ? engine.sentence(q.verb, q.tense, q.person) : undefined;
  useEffect(() => (result ? next.current?.focus() : input.current?.focus()), [result]);
  const check = () => {
    const r = checkAnswer(value, engine.answer(q.verb, q.tense, q.person), rules);
    const ok = r.result === 'goed';
    play(ok ? 'goed' : 'fout');
    setResult({ ok, expected: sentence ? engine.bare(q.verb, q.tense, q.person) : engine.conjugate(q.verb, q.tense)[q.person]! });
  };
  const why = engine.explain(q.verb, q.tense, q.person);
  return (
    <>
      <div className="rounded-[28px] border border-line bg-surface px-6 py-7 text-center shadow-soft">
        {s ? (
          <p className="text-xl leading-relaxed font-semibold" lang={lang}>
            {s.before}
            <span className="mx-1 inline-block min-w-16 border-b-2 border-ink-soft text-primary-ink">{result ? engine.bare(q.verb, q.tense, q.person) : ' '}</span>
            {s.after}
            <span className="mt-2 block text-sm font-normal text-ink-soft">{q.verb} · {tense.label}</span>
          </p>
        ) : (
          <>
            <p className="text-[clamp(26px,7vw,38px)] font-extrabold" lang={lang}>{q.verb}</p>
            <p className="mt-1 text-lg text-ink-soft">
              {tense.label} · <strong className="text-ink">{engine.persons[q.person]}</strong>
            </p>
          </>
        )}
      </div>
      {result ? (
        <>
          <Verdict kind={result.ok ? 'goed' : 'fout'}>
            {!result.ok && <AnswerDiff given={value} expected={result.expected} />}
            {result.ok && <p lang={lang} className="font-semibold">{result.expected}</p>}
            {why && <p className="mt-2 text-sm">💡 {why}</p>}
          </Verdict>
          <Button ref={next} size="lg" className="justify-center" onClick={() => onDone(result.ok)}>Volgende</Button>
        </>
      ) : (
        <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); check(); }}>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            lang={lang}
            aria-label="Jouw antwoord"
            autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
            placeholder={sentence ? 'Werkwoordsvorm' : 'Typ de vorm (met of zonder voornaamwoord)'}
            className="h-14 w-full rounded-2xl border-2 border-line bg-surface px-4 text-center text-xl font-semibold focus-visible:border-primary"
          />
          <CharBar lang={lang} onPick={(c) => input.current && insertAtCursor(input.current, c)} className="justify-center" />
          <Button type="submit" size="lg" className="justify-center">Controleren</Button>
        </form>
      )}
    </>
  );
}

/** Oefenvorm B: het hele rijtje. */
function RowExercise({ ctx, q, onDone }: { ctx: Ctx; q: VerbQuestion; onDone: (ok: boolean) => void }) {
  const { engine, lang, rules } = ctx;
  const tense = engine.tenses.find((t) => t.id === q.tense)!;
  const persons = (tense.persons ?? [0, 1, 2, 3, 4, 5]).filter((p) => engine.conjugate(q.verb, q.tense)[p]);
  const [values, setValues] = useState<string[]>(['', '', '', '', '', '']);
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const [active, setActive] = useState<HTMLInputElement | null>(null);
  const check = () => {
    const r = [0, 1, 2, 3, 4, 5].map((p) => !persons.includes(p) || checkAnswer(values[p]!, engine.answer(q.verb, q.tense, p), rules).result === 'goed');
    play(r.every(Boolean) ? 'goed' : 'fout');
    setChecked(r);
  };
  return (
    <>
      <div className="rounded-[28px] border border-line bg-surface px-6 py-5 text-center shadow-soft">
        <p className="text-3xl font-extrabold" lang={lang}>{q.verb}</p>
        <p className="text-ink-soft">{tense.label}</p>
      </div>
      <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); if (!checked) check(); }}>
        {persons.map((p, idx) => (
          <label key={p} className={cn('grid grid-cols-[110px_1fr] items-center gap-2 rounded-xl p-1', checked && (checked[p] ? 'bg-primary-soft' : 'bg-danger/10'))}>
            <span className="pl-2 font-semibold text-ink-soft">{engine.persons[p]}</span>
            <span>
              <input
                autoFocus={idx === 0}
                value={values[p]}
                readOnly={!!checked}
                onFocus={(e) => setActive(e.currentTarget)}
                onChange={(e) => setValues((v) => v.map((x, i) => (i === p ? e.target.value : x)))}
                lang={lang}
                aria-label={`${engine.persons[p]}`}
                autoComplete="off" autoCapitalize="off" spellCheck={false}
                className="h-11 w-full rounded-xl border border-line bg-surface px-3 font-semibold"
              />
              {checked && !checked[p] && <span className="mt-0.5 block text-sm font-semibold text-danger" lang={lang}>✗ {engine.bare(q.verb, q.tense, p)}</span>}
            </span>
          </label>
        ))}
        {!checked && <CharBar lang={lang} onPick={(c) => active && insertAtCursor(active, c)} className="justify-center" />}
        {checked ? (
          <>
            {engine.explain(q.verb, q.tense, 0) && <p className="rounded-xl bg-surface-2 p-3 text-sm">💡 {engine.explain(q.verb, q.tense, 0)}</p>}
            <Button size="lg" className="justify-center" onClick={() => onDone(checked.every(Boolean))}>Volgende</Button>
          </>
        ) : (
          <Button type="submit" size="lg" className="justify-center">Nakijken</Button>
        )}
      </form>
    </>
  );
}

/** Oefenvorm D: omgekeerd — welke vorm is dit? */
function ReverseExercise({ ctx, q, onDone }: { ctx: Ctx; q: VerbQuestion; onDone: (ok: boolean) => void }) {
  const { engine, lang, initial } = ctx;
  const shown = engine.conjugate(q.verb, q.tense)[q.person]!;
  const verbs = useMemo(() => [...new Set([q.verb, ...initial.map((x) => x.verb)])].sort(), [q.verb]);
  const tenses = useMemo(() => [...new Set([q.tense, ...initial.map((x) => x.tense)])], [q.tense]);
  const [verb, setVerb] = useState('');
  const [tense, setTense] = useState('');
  const [person, setPerson] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const check = () => {
    // Goed als jouw keuze precies deze vorm oplevert (sommige vormen horen bij meer personen).
    const ok = !!verb && !!tense && person !== '' && engine.conjugate(verb, tense)[Number(person)] === shown;
    play(ok ? 'goed' : 'fout');
    setResult(ok);
  };
  return (
    <>
      <div className="rounded-[28px] border border-line bg-surface px-6 py-8 text-center shadow-soft">
        <p className="text-sm text-ink-soft">Welke vorm is dit?</p>
        <p className="text-[clamp(24px,7vw,36px)] font-extrabold" lang={lang}>{shown}</p>
      </div>
      <div className="grid gap-2">
        <Select aria-label="Werkwoord" value={verb} onChange={(e) => setVerb(e.target.value)} disabled={result !== null}>
          <option value="">Werkwoord…</option>
          {verbs.map((v) => <option key={v}>{v}</option>)}
        </Select>
        <Select aria-label="Tijd" value={tense} onChange={(e) => setTense(e.target.value)} disabled={result !== null}>
          <option value="">Tijd…</option>
          {tenses.map((t) => <option key={t} value={t}>{engine.tenses.find((x) => x.id === t)?.label}</option>)}
        </Select>
        <Select aria-label="Persoon" value={person} onChange={(e) => setPerson(e.target.value)} disabled={result !== null}>
          <option value="">Persoon…</option>
          {engine.persons.map((p, i) => <option key={p} value={i}>{p}</option>)}
        </Select>
      </div>
      {result === null ? (
        <Button size="lg" className="justify-center" onClick={check} disabled={!verb || !tense || person === ''}>Controleren</Button>
      ) : (
        <>
          <Verdict kind={result ? 'goed' : 'fout'}>
            {!result && <p>Het is: <strong lang={lang}>{q.verb}</strong>, {engine.tenses.find((t) => t.id === q.tense)?.label}, {engine.persons[q.person]}.</p>}
          </Verdict>
          <Button size="lg" className="justify-center" onClick={() => onDone(result)}>Volgende</Button>
        </>
      )}
    </>
  );
}

