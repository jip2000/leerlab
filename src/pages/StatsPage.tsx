import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Lock } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { db } from '@/db/db';
import { withArticle } from '@/data/starter';
import { useProfile } from '@/features/progress/hooks';
import { badgeDefs } from '@/features/progress/badges';
import { dayKey } from '@/features/progress/streak';
import { StreakCard } from '@/features/progress/components/StreakCard';
import { LevelBar } from '@/features/progress/components/LevelBar';
import { ColumnChart } from '@/features/stats/ColumnChart';
import { Heatmap } from '@/features/stats/Heatmap';
import { dailyMinutes, weeklyMinutes } from '@/features/stats/data';
import { bestSubjects, hardestWords, knownWords } from '@/features/stats/queries';
import { cn } from '@/lib/cn';

function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="text-[28px] leading-tight font-extrabold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}

export function StatsPage() {
  const profile = useProfile();
  const days = useLiveQuery(() => db.days.toArray(), []);
  const hardest = useLiveQuery(() => hardestWords(10), []);
  const subjects = useLiveQuery(() => bestSubjects(), []);
  const known = useLiveQuery(() => knownWords(), []);
  const sessions = useLiveQuery(() => db.sessions.filter((s) => !!s.endedAt).count(), []);
  const [range, setRange] = useState<'dag' | 'week'>('dag');
  if (!profile || !days) return null;

  const today = dayKey();
  const earned = badgeDefs.filter((b) => profile.badges.has(b.id)).length;
  const weekMin = dailyMinutes(days, today, 7).reduce((s, p) => s + p.value, 0);
  const series = range === 'dag' ? dailyMinutes(days, today, 14) : weeklyMinutes(days, today, 12);

  return (
    <>
      <PageHeader title="Statistieken" intro="Hoeveel je oefent, wat je al kent en welke badges je hebt." />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Geoefend deze week" value={`${weekMin} min`} />
        <Tile label="Woorden gekend" value={known ?? 0} sub="in bakje 4 of 5" />
        <Tile label="Oefeningen afgerond" value={sessions ?? 0} />
        <Tile label="Vragen goed" value={profile.correctTotal} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StreakCard profile={profile} />
        <Card className="flex flex-col justify-center gap-4">
          <LevelBar profile={profile} />
          <p className="text-sm text-ink-soft">{profile.xp} XP in totaal. Elke oefening brengt je dichter bij het volgende level.</p>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Oefentijd in minuten</h2>
          <div role="radiogroup" aria-label="Periode" className="inline-flex rounded-xl bg-surface-2 p-1">
            {(['dag', 'week'] as const).map((r) => (
              <button key={r} type="button" role="radio" aria-checked={range === r} onClick={() => setRange(r)}
                className={cn('h-9 rounded-lg px-3 text-sm font-semibold', range === r ? 'bg-surface shadow-soft' : 'text-ink-soft')}>
                {r === 'dag' ? 'Per dag (14 dagen)' : 'Per week (12 weken)'}
              </button>
            ))}
          </div>
        </div>
        <ColumnChart data={series} unit="min" label="Oefentijd in minuten" />
      </Card>

      <Card className="mt-4">
        <h2 className="mb-3 text-lg font-bold">Kalender</h2>
        <Heatmap days={days} today={today} />
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-bold">Beste vakken</h2>
          {!subjects?.length ? (
            <p className="text-sm text-ink-soft">Na een paar oefeningen zie je hier per taal hoeveel procent je goed hebt.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {subjects.map((s) => (
                <li key={s.lang}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold">{s.name}</span>
                    <span className="tabular-nums text-ink-soft">{s.pct}% goed ({s.total})</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`${s.name}: ${s.pct}% goed`}>
                    <div className="h-full rounded-r-[4px] bg-[var(--chart-1)]" style={{ width: `${s.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-bold">Moeilijkste woorden</h2>
          {!hardest?.length ? (
            <p className="text-sm text-ink-soft">Nog geen fouten gemaakt. Knap!</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sr-only"><tr><th>Woord</th><th>Vertaling</th><th>Aantal keer fout</th></tr></thead>
              <tbody>
                {hardest.map((w) => (
                  <tr key={w.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-2 font-semibold">{withArticle(w.left, w.article)}</td>
                    <td className="py-2 pr-2">{w.right}<span className="block text-xs text-ink-soft">{w.list}</span></td>
                    <td className="py-2 text-right font-bold tabular-nums">{w.wrong}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-extrabold tracking-[-0.015em]">
          Badges <span className="text-base font-semibold text-ink-soft">({earned} van {badgeDefs.length})</span>
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {badgeDefs.map((b) => {
            const has = profile.badges.has(b.id);
            return (
              <li key={b.id} className={cn('flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-center', has ? 'border-line bg-surface shadow-soft' : 'border-dashed border-line')}>
                <span className={cn('grid h-14 w-14 place-items-center rounded-full text-3xl', has ? 'bg-marker/50' : 'bg-surface-2 grayscale')} aria-hidden="true">
                  {has ? b.emoji : <Lock size={20} className="text-ink-soft" />}
                </span>
                <span className="font-bold">{b.title}</span>
                <span className="text-sm text-ink-soft">{b.description}</span>
                {has && <span className="text-xs text-ink-soft">{new Date(profile.badges.get(b.id)!).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}</span>}
                <span className="sr-only">{has ? 'Behaald' : 'Nog niet behaald'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
