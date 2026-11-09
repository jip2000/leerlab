import { motion } from 'motion/react';
import { Flame, Snowflake } from 'lucide-react';
import { cn } from '@/lib/cn';
import { dayKey, weekDays } from '../streak';
import type { Profile } from '../repo';

const dayLetters = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

/** Streak met vlam en de dagen van deze week. */
export function StreakCard({ profile }: { profile: Profile }) {
  const today = dayKey();
  const { count, todayDone } = profile.streak;
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <motion.div
          animate={todayDone ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
          className={cn('grid h-16 w-16 shrink-0 place-items-center rounded-2xl', todayDone ? 'bg-marker text-marker-ink' : 'bg-surface-2 text-ink-soft')}
        >
          <Flame size={34} strokeWidth={2.4} aria-hidden="true" fill={todayDone ? 'currentColor' : 'none'} />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="text-[34px] leading-none font-extrabold tracking-[-0.03em]">
            {count} <span className="text-lg font-bold text-ink-soft">{count === 1 ? 'dag' : 'dagen'} op rij</span>
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {todayDone ? 'Vandaag gedaan. Tot morgen!' : count > 0 ? 'Oefen vandaag om je streak te houden.' : 'Oefen vandaag en start een streak.'}
          </p>
        </div>
        {profile.freezes > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-[#2F6FDB]/12 px-2.5 py-1 text-sm font-bold text-[#2F6FDB] dark:text-[#8DB5FF]" title="Bevriezers: mis je een dag, dan blijft je streak heel.">
            <Snowflake size={16} aria-hidden="true" /> {profile.freezes}
            <span className="sr-only">{profile.freezes === 1 ? 'bevriezer' : 'bevriezers'}</span>
          </span>
        )}
      </div>
      <ol className="grid grid-cols-7 gap-1.5" aria-label="Deze week">
        {weekDays(today).map((d, i) => {
          const state = profile.week.get(d);
          const isToday = d === today;
          return (
            <li key={d} className="flex flex-col items-center gap-1">
              <span className={cn('text-xs font-semibold', isToday ? 'text-ink' : 'text-ink-soft')}>{dayLetters[i]}</span>
              <span
                className={cn(
                  'grid h-8 w-8 place-items-center rounded-full border-2',
                  state === 'actief' ? 'border-transparent bg-marker text-marker-ink' : state === 'bevroren' ? 'border-transparent bg-[#2F6FDB]/15 text-[#2F6FDB]' : 'border-line',
                  isToday && !state && 'border-dashed border-ink-soft',
                )}
              >
                {state === 'actief' && <Flame size={15} aria-label="geoefend" fill="currentColor" />}
                {state === 'bevroren' && <Snowflake size={15} aria-label="bevroren" />}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
