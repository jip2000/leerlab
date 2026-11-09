import { useState } from 'react';
import { heatmap } from './data';
import type { DayActivity } from '@/db/types';

const fmt = (d: string) => new Date(`${d}T12:00`).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' });
const LEVEL = ['var(--surface-2)', 'var(--heat-1)', 'var(--heat-2)', 'var(--heat-3)', 'var(--heat-4)'];

/** Kalender met een vakje per dag: hoe donkerder, hoe meer geoefend. */
export function Heatmap({ days, today, weeks = 20 }: { days: DayActivity[]; today: string; weeks?: number }) {
  const grid = heatmap(days, today, weeks);
  const [hover, setHover] = useState<{ date: string; answers: number } | null>(null);
  const active = days.filter((d) => d.answers > 0 && d.id >= grid[0]![0]!.date).length;
  return (
    <div>
      <div className="flex gap-[3px] overflow-x-auto pb-1" role="img" aria-label={`Kalender: ${active} dagen geoefend in de laatste ${weeks} weken`}>
        {grid.map((week, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {week.map((c) => (
              <span
                key={c.date}
                title={c.future ? undefined : `${fmt(c.date)}: ${c.answers} antwoorden`}
                onPointerEnter={() => !c.future && setHover(c)}
                onPointerLeave={() => setHover(null)}
                className="block h-3.5 w-3.5 rounded-[3px]"
                style={{ background: c.future ? 'transparent' : LEVEL[c.level], outline: c.date === today ? '2px solid var(--ink)' : undefined, outlineOffset: 1 }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
        <span aria-live="polite">{hover ? `${fmt(hover.date)}: ${hover.answers} antwoorden` : `${active} dagen geoefend`}</span>
        <span className="flex items-center gap-1">
          minder {LEVEL.map((c, i) => <span key={i} className="inline-block h-3 w-3 rounded-[3px]" style={{ background: c }} aria-hidden="true" />)} meer
        </span>
      </div>
    </div>
  );
}
