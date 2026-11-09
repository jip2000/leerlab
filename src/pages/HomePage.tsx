import { Link, useNavigate } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { Layers, Play, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { dueToday, startReview } from '@/features/srs/repo';
import { planFor, startTask, upcomingTests } from '@/features/planner/repo';
import { daysBetween, describeTask } from '@/features/planner/schedule';
import { dayKey } from '@/features/progress/streak';
import { CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { useSettings } from '@/lib/settings';
import { useLists } from '@/features/lists/hooks';
import { sortLists } from '@/features/lists/sort';
import { openSession } from '@/features/practice/repo';
import { modeLabels } from '@/features/practice/labels';
import { useProfile } from '@/features/progress/hooks';
import { goalProgress } from '@/features/progress/repo';
import { badgeDefs } from '@/features/progress/badges';
import { StreakCard } from '@/features/progress/components/StreakCard';
import { LevelBar } from '@/features/progress/components/LevelBar';

function greeting(hour: number) {
  if (hour < 6) return 'Goedenacht';
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

export function HomePage() {
  const dagdoel = useSettings((s) => s.dagdoel);
  const profile = useProfile();
  const lists = useLists();
  const paused = useLiveQuery(() => openSession(), []);
  const due = useLiveQuery(() => dueToday(), []);
  // Eerstvolgende toets binnen 2 weken, met de taak van vandaag.
  const nextTest = useLiveQuery(async () => {
    const t = (await upcomingTests()).find((x) => daysBetween(dayKey(), x.date) <= 14);
    if (!t) return null;
    const today = (await planFor(t)).find((p) => p.date === dayKey());
    return { test: t, today };
  }, []);
  const navigate = useNavigate();

  if (!profile || !lists) return null;

  const goal = goalProgress(profile.today, dagdoel);
  const unit = dagdoel.type === 'minuten' ? 'minuten' : 'woorden goed';
  const last = sortLists(lists, 'nieuw')[0];
  const recentBadges = badgeDefs
    .filter((b) => profile.badges.has(b.id))
    .sort((a, b) => profile.badges.get(b.id)! - profile.badges.get(a.id)!)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <header className="mb-1">
        <h1 className="text-[30px] leading-[1.15] font-extrabold tracking-[-0.025em] sm:text-[38px]">
          <span className="marker">{greeting(new Date().getHours())}!</span>
        </h1>
        <p className="mt-2 text-ink-soft">
          {profile.streak.todayDone ? 'Lekker bezig vandaag.' : 'Even oefenen? Een paar minuten is al genoeg.'}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <StreakCard profile={profile} />

        <Card className="flex items-center gap-5">
          <ProgressRing value={goal.done / goal.target} label={`Dagdoel: ${goal.done} van ${goal.target} ${unit}`}>
            <span className="text-xl font-extrabold">
              {Math.min(goal.done, 999)}
              <span className="text-sm font-semibold text-ink-soft">/{goal.target}</span>
            </span>
          </ProgressRing>
          <div className="min-w-0">
            <h2 className="font-bold">{goal.reached ? 'Dagdoel gehaald!' : 'Dagdoel'}</h2>
            <p className="text-sm text-ink-soft">
              {goal.target} {unit} per dag.{' '}
              <Link to="/instellingen" className="font-semibold text-primary-ink underline underline-offset-2">
                Aanpassen
              </Link>
            </p>
            <div className="mt-3">
              <LevelBar profile={profile} />
            </div>
          </div>
        </Card>
      </div>

      {nextTest && (
        <Card className="flex flex-wrap items-center gap-4 border-danger/30">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-danger/12 text-danger"><CalendarDays size={24} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold">
              Toets {nextTest.test.subject}{' '}
              {(() => { const n = daysBetween(dayKey(), nextTest.test.date); return n === 0 ? 'vandaag!' : n === 1 ? 'morgen' : `over ${n} dagen`; })()}
            </h2>
            <p className="text-sm text-ink-soft">
              {nextTest.today ? `Vandaag ${nextTest.today.minutes} minuten oefenen: ${describeTask(nextTest.today.tasks[0]!)}` : 'Succes! Kijk nog even je fouten na.'}
            </p>
          </div>
          {nextTest.today && <Button onClick={async () => navigate(await startTask(nextTest.today!.tasks[0]!))}>Start</Button>}
        </Card>
      )}

      {due && due.length > 0 && (
        <Card tone="mint" className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-primary-ink">Vandaag herhalen</h2>
            <p className="text-[34px] leading-none font-extrabold tracking-[-0.03em]">
              {due.length} <span className="text-base font-bold text-ink-soft">{due.length === 1 ? 'woord' : 'woorden'}</span>
            </p>
            <p className="mt-1 text-sm text-ink-soft">Herhaal ze nu, dan onthoud je ze veel beter.</p>
          </div>
          <Button
            size="lg"
            icon={<RefreshCw size={18} aria-hidden="true" />}
            onClick={async () => {
              const id = await startReview();
              if (id) navigate(`/oefenen/${id}`);
            }}
          >
            Start herhalen
          </Button>
        </Card>
      )}

      {paused ? (
        <Card tone="mint" className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-primary-ink">Verder waar je was</h2>
            <p className="text-sm text-ink-soft">
              {modeLabels[paused.state.options.mode]}, nog {new Set(paused.state.engine.queue).size} van {paused.state.engine.cards.length} kaarten
            </p>
          </div>
          <ButtonLink to={`/oefenen/${paused.id}`}>
            <Play size={18} aria-hidden="true" /> Verder
          </ButtonLink>
        </Card>
      ) : last ? (
        <Card tone="mint" className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-primary-ink">Oefen je laatste lijst</h2>
            <p className="truncate text-sm text-ink-soft">{last.title}</p>
          </div>
          <ButtonLink to={`/oefenen?lijsten=${last.id}`}>
            <Layers size={18} aria-hidden="true" /> Oefenen
          </ButtonLink>
        </Card>
      ) : (
        <Card tone="mint" className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-primary-ink">Begin met een lijst</h2>
            <p className="text-sm text-ink-soft">Maak een lijst voor je volgende toets, of probeer een startlijst.</p>
          </div>
          <ButtonLink to="/lijsten/nieuw">
            <Plus size={18} aria-hidden="true" /> Maak je eerste lijst
          </ButtonLink>
        </Card>
      )}

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Badges</h2>
          <Link to="/statistieken" className="flex h-11 items-center text-sm font-semibold text-primary-ink underline underline-offset-2">
            Alle {badgeDefs.length} badges
          </Link>
        </div>
        {recentBadges.length === 0 ? (
          <p className="text-sm text-ink-soft">Je eerste badge krijg je al na je eerste lijst. Hoeveel verzamel jij er?</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {recentBadges.map((b) => (
              <li key={b.id} className="flex items-center gap-2 rounded-full bg-surface-2 py-1.5 pr-3.5 pl-2 text-sm font-semibold">
                <span className="text-xl" aria-hidden="true">
                  {b.emoji}
                </span>
                {b.title}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
