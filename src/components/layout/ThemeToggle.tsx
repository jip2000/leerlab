import { Monitor, Moon, Sun } from 'lucide-react';
import { useSettings, type ThemeChoice } from '@/lib/settings';

const next: Record<ThemeChoice, ThemeChoice> = { systeem: 'licht', licht: 'donker', donker: 'systeem' };
const label: Record<ThemeChoice, string> = { systeem: 'zoals je systeem', licht: 'licht', donker: 'donker' };

/** Wisselt tussen systeem → licht → donker. */
export function ThemeToggle() {
  const thema = useSettings((s) => s.thema);
  const setThema = useSettings((s) => s.setThema);
  const Icon = thema === 'licht' ? Sun : thema === 'donker' ? Moon : Monitor;
  return (
    <button
      type="button"
      onClick={() => setThema(next[thema])}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface-2 hover:text-ink"
      aria-label={`Thema: ${label[thema]}. Klik om te wisselen.`}
      title={`Thema: ${label[thema]}`}
    >
      <Icon size={20} strokeWidth={2.2} />
    </button>
  );
}
