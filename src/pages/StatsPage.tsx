import { Lock } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { useProfile } from '@/features/progress/hooks';
import { badgeDefs } from '@/features/progress/badges';
import { StreakCard } from '@/features/progress/components/StreakCard';
import { LevelBar } from '@/features/progress/components/LevelBar';
import { cn } from '@/lib/cn';

export function StatsPage() {
  const profile = useProfile();
  if (!profile) return null;
  const earned = badgeDefs.filter((b) => profile.badges.has(b.id)).length;

  return (
    <>
      <PageHeader title="Statistieken" intro="Je streak, je level en je badges. Grafieken komen er later bij." />
      <div className="grid gap-4 md:grid-cols-2">
        <StreakCard profile={profile} />
        <Card className="flex flex-col justify-center gap-4">
          <LevelBar profile={profile} />
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-surface-2 p-3">
              <dt className="text-sm text-ink-soft">XP totaal</dt>
              <dd className="text-2xl font-extrabold tabular-nums">{profile.xp}</dd>
            </div>
            <div className="rounded-2xl bg-surface-2 p-3">
              <dt className="text-sm text-ink-soft">Vragen goed</dt>
              <dd className="text-2xl font-extrabold tabular-nums">{profile.correctTotal}</dd>
            </div>
          </dl>
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
              <li
                key={b.id}
                className={cn('flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-center', has ? 'border-line bg-surface shadow-soft' : 'border-dashed border-line')}
              >
                <span className={cn('grid h-14 w-14 place-items-center rounded-full text-3xl', has ? 'bg-marker/50' : 'bg-surface-2 grayscale')} aria-hidden="true">
                  {has ? b.emoji : <Lock size={20} className="text-ink-soft" />}
                </span>
                <span className="font-bold">{b.title}</span>
                <span className="text-sm text-ink-soft">{b.description}</span>
                {has && (
                  <span className="text-xs text-ink-soft">
                    {new Date(profile.badges.get(b.id)!).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                  </span>
                )}
                <span className="sr-only">{has ? 'Behaald' : 'Nog niet behaald'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
