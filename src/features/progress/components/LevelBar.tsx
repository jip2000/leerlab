import type { Profile } from '../repo';

export function LevelBar({ profile }: { profile: Profile }) {
  const { level, into, needed } = profile.level;
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-lg font-extrabold text-on-primary" aria-hidden="true">
        {level}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-bold">Level {level}</span>
          <span className="text-ink-soft tabular-nums">
            {into}/{needed} XP
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label={`Level ${level}`} aria-valuemin={0} aria-valuemax={needed} aria-valuenow={into}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${(into / needed) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
