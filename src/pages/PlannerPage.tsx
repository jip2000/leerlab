import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field, Select } from '@/components/ui/Field';
import { db, newId } from '@/db/db';
import type { PlannedTest } from '@/db/types';
import { languages, type LanguageCode } from '@/data/languages';
import { grammar } from '@/data/grammar';
import { useLists, useWordCounts } from '@/features/lists/hooks';
import { planFor, startTask } from '@/features/planner/repo';
import { daysBetween, describeTask, type PlanDay, type Task } from '@/features/planner/schedule';
import { addDays, dayKey, weekDays } from '@/features/progress/streak';
import { cn } from '@/lib/cn';
import { toast } from '@/lib/toast';

const dayName = (d: string) => new Date(`${d}T12:00`).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
const short = (d: string) => new Date(`${d}T12:00`).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric' });

function usePlans(tests: PlannedTest[] | undefined) {
  const [plans, setPlans] = useState<Map<string, PlanDay[]>>(new Map());
  useEffect(() => {
    if (!tests) return;
    void Promise.all(tests.map(async (t) => [t.id, await planFor(t)] as const)).then((e) => setPlans(new Map(e)));
  }, [tests]);
  return plans;
}

export function PlannerPage() {
  const today = dayKey();
  const tests = useLiveQuery(() => db.tests.where('date').aboveOrEqual(today).sortBy('date'), [today]);
  const lists = useLists();
  const counts = useWordCounts();
  const plans = usePlans(tests);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [week, setWeek] = useState(0);
  const [form, setForm] = useState({ subject: '', date: addDays(today, 7), listIds: [] as string[], lang: 'fr' as LanguageCode, topicIds: [] as string[] });
  const [error, setError] = useState('');

  const days = weekDays(addDays(today, week * 7));
  const agenda = useMemo(() => {
    const m = new Map<string, { test?: PlannedTest; tasks: { test: PlannedTest; task: Task }[]; minutes: number }>();
    for (const d of days) m.set(d, { tasks: [], minutes: 0 });
    for (const t of tests ?? []) {
      if (m.has(t.date)) m.get(t.date)!.test = t;
      for (const p of plans.get(t.id) ?? []) {
        const e = m.get(p.date);
        if (!e) continue;
        e.tasks.push(...p.tasks.map((task) => ({ test: t, task })));
        e.minutes += p.minutes;
      }
    }
    return m;
  }, [days.join(), tests, plans]);

  const save = async () => {
    if (!form.subject.trim()) return setError('Voor welk vak is de toets?');
    if (daysBetween(today, form.date) < 1) return setError('Kies een datum na vandaag.');
    if (form.listIds.length === 0 && form.topicIds.length === 0) return setError('Kies minstens één lijst of onderwerp.');
    await db.tests.add({ id: newId(), subject: form.subject.trim(), date: form.date, listIds: form.listIds, topicIds: form.topicIds });
    setAdding(false);
    setError('');
    toast('Toets gepland. Je leerschema staat klaar.');
  };

  if (!tests || !lists || !counts) return null;

  return (
    <>
      <PageHeader
        title="Planner"
        intro="Zet je toetsen erin en krijg elke dag een stukje om te leren."
        actions={!adding && <Button icon={<Plus size={18} aria-hidden="true" />} onClick={() => setAdding(true)}>Toets toevoegen</Button>}
      />

      {adding && (
        <form className="mb-6 grid gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); void save(); }}>
          <Field label="Vak">
            <Input autoFocus value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Bijvoorbeeld: Frans" />
          </Field>
          <Field label="Datum van de toets">
            <Input type="date" min={addDays(today, 1)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <fieldset className="sm:col-span-2">
            <legend className="mb-1.5 text-sm font-semibold">Woordenlijsten</legend>
            <ul className="grid max-h-56 gap-1 overflow-y-auto rounded-2xl border border-line p-2 sm:grid-cols-2">
              {lists.map((l) => (
                <li key={l.id}>
                  <label className="flex min-h-11 items-center gap-2 rounded-lg px-2 hover:bg-surface-2">
                    <input type="checkbox" className="h-5 w-5 accent-[var(--primary)]" checked={form.listIds.includes(l.id)} onChange={(e) => setForm({ ...form, listIds: e.target.checked ? [...form.listIds, l.id] : form.listIds.filter((x) => x !== l.id) })} />
                    <span className="truncate">{l.title}</span>
                    <span className="ml-auto text-sm text-ink-soft">{counts.get(l.id) ?? 0}</span>
                  </label>
                </li>
              ))}
              {lists.length === 0 && <li className="p-2 text-sm text-ink-soft">Je hebt nog geen lijsten.</li>}
            </ul>
          </fieldset>
          <fieldset className="sm:col-span-2">
            <legend className="mb-1.5 text-sm font-semibold">Grammatica (optioneel)</legend>
            <Select value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value as LanguageCode })} aria-label="Taal voor grammatica" className="mb-2 w-auto">
              {Object.keys(grammar).map((code) => <option key={code} value={code}>{languages.find((l) => l.code === code)!.name}</option>)}
            </Select>
            <div className="flex flex-wrap gap-2">
              {grammar[form.lang]!.map((t) => {
                const id = `${form.lang}:${t.id}`;
                const on = form.topicIds.includes(id);
                return (
                  <button key={id} type="button" aria-pressed={on} onClick={() => setForm({ ...form, topicIds: on ? form.topicIds.filter((x) => x !== id) : [...form.topicIds, id] })}
                    className={cn('min-h-11 rounded-full border px-3 text-sm font-semibold', on ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line text-ink-soft')}>
                    {languages.find((l) => l.code === form.lang)!.grammarTopics.find((x) => x.id === t.id)?.title}
                  </button>
                );
              })}
            </div>
          </fieldset>
          {error && <p role="alert" className="font-semibold text-danger sm:col-span-2">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">Plan de toets</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Annuleren</Button>
          </div>
        </form>
      )}

      {tests.length === 0 && !adding ? (
        <EmptyState icon={<CalendarDays size={24} />} title="Nog geen toetsen gepland" text="Kies een vak, een datum en de lijsten voor je toets. Woordwerk verdeelt de woorden over de dagen ervoor; de laatste dagen herhaal je alles." action={<Button onClick={() => setAdding(true)}>Toets toevoegen</Button>} />
      ) : (
        <>
          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Week</h2>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" aria-label="Vorige week" onClick={() => setWeek((w) => w - 1)}><ChevronLeft size={20} /></Button>
                <Button variant="ghost" onClick={() => setWeek(0)}>Deze week</Button>
                <Button variant="ghost" size="icon" aria-label="Volgende week" onClick={() => setWeek((w) => w + 1)}><ChevronRight size={20} /></Button>
              </div>
            </div>
            <ol className="grid gap-2 md:grid-cols-7">
              {days.map((d) => {
                const e = agenda.get(d)!;
                return (
                  <li key={d} className={cn('min-h-24 rounded-2xl border p-2.5', d === today ? 'border-primary bg-primary-soft/50' : 'border-line bg-surface')}>
                    <p className="text-sm font-bold capitalize">{short(d)}</p>
                    {e.test && <p className="mt-1 rounded-lg bg-danger/12 px-2 py-1 text-sm font-bold text-danger">Toets {e.test.subject}</p>}
                    {e.tasks.length > 0 && <p className="mt-1 text-sm text-ink-soft">{e.minutes} min</p>}
                    <ul className="mt-1 flex flex-col gap-1">
                      {e.tasks.map(({ test, task }, i) => (
                        <li key={i} className="text-xs leading-snug">
                          <span className="font-semibold">{test.subject}:</span> {describeTask(task)}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-extrabold">Toetsen</h2>
            <ul className="flex flex-col gap-3">
              {tests.map((t) => {
                const plan = plans.get(t.id) ?? [];
                const todayPlan = plan.find((p) => p.date === today);
                const n = daysBetween(today, t.date);
                return (
                  <li key={t.id} className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-bold">Toets {t.subject}</p>
                        <p className="text-sm text-ink-soft first-letter:uppercase">{dayName(t.date)}, {n === 0 ? 'vandaag!' : n === 1 ? 'morgen' : `over ${n} dagen`}</p>
                      </div>
                      <Button variant="ghost" size="icon" aria-label={`Toets ${t.subject} verwijderen`} onClick={() => void db.tests.delete(t.id)}><Trash2 size={18} /></Button>
                    </div>
                    {todayPlan && (
                      <div className="mt-3 rounded-2xl bg-primary-soft p-3">
                        <p className="font-bold text-primary-ink">Vandaag ({todayPlan.minutes} minuten)</p>
                        <ul className="mt-1 flex flex-col gap-2">
                          {todayPlan.tasks.map((task, i) => (
                            <li key={i} className="flex flex-wrap items-center justify-between gap-2">
                              <span>{describeTask(task)}</span>
                              <Button onClick={async () => navigate(await startTask(task))}>Start</Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-semibold text-primary-ink">Hele leerschema ({plan.length} dagen)</summary>
                      <ol className="mt-2 flex flex-col gap-1 text-sm">
                        {plan.map((p) => (
                          <li key={p.date} className={cn('rounded-lg px-2 py-1', p.date === today && 'bg-surface-2 font-semibold')}>
                            <span className="capitalize">{short(p.date)}</span> ({p.minutes} min): {p.tasks.map(describeTask).join('; ')}
                          </li>
                        ))}
                      </ol>
                    </details>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
