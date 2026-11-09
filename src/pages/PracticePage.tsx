import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { CircleCheckBig, GalleryHorizontalEnd, Keyboard, ListChecks, Play, Trash2, type LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Switch } from '@/components/ui/Switch';
import { getLanguage } from '@/data/languages';
import type { Direction } from '@/db/types';
import { useLists, useWordCounts } from '@/features/lists/hooks';
import { sortLists } from '@/features/lists/sort';
import type { Mode } from '@/features/practice/engine';
import { discardOpenSessions, hardWordIds, openSession, startSession, type StoredSession } from '@/features/practice/repo';
import { modeLabels } from '@/features/practice/labels';
import { cn } from '@/lib/cn';
import { toast } from '@/lib/toast';

const modes: { id: Mode; icon: LucideIcon; text: string }[] = [
  { id: 'flashcards', icon: GalleryHorizontalEnd, text: 'Kaart omdraaien en zelf zeggen of je het wist.' },
  { id: 'typen', icon: Keyboard, text: 'Typ de vertaling. Fout? Dan komt hij later terug.' },
  { id: 'meerkeuze', icon: ListChecks, text: 'Kies het goede antwoord uit vier.' },
  { id: 'toets', icon: CircleCheckBig, text: 'Elk woord één keer, zonder hulp. Je krijgt een cijfer.' },
];
const later = ['Luisteren', 'Koppelen', 'Snel-ronde', 'Leren'];

function Choice<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-2xl bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn('min-h-11 rounded-xl px-2 text-sm font-semibold', value === o.id ? 'bg-surface text-ink shadow-soft' : 'text-ink-soft')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PracticePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const lists = useLists();
  const counts = useWordCounts();
  const open = useLiveQuery(() => openSession(), [], null as StoredSession | undefined | null);

  const [selected, setSelected] = useState<string[]>(() => params.get('lijsten')?.split(',').filter(Boolean) ?? []);
  const [mode, setMode] = useState<Mode>('flashcards');
  const [direction, setDirection] = useState<Direction | 'mix'>('lr');
  const [shuffle, setShuffle] = useState(true);
  const [onlyHard, setOnlyHard] = useState(false);
  const hardCount = useLiveQuery(async () => (selected.length ? (await hardWordIds(selected)).size : 0), [selected.join(',')]);

  // Als er nog niets gekozen is, kies de laatst gewijzigde lijst.
  useEffect(() => {
    if (lists && lists.length && selected.length === 0 && !params.get('lijsten')) setSelected([sortLists(lists, 'nieuw')[0]!.id]);
  }, [lists]);

  const sorted = useMemo(() => (lists ? sortLists(lists, 'nieuw') : []), [lists]);
  if (!lists || !counts || open === null) return null;

  if (lists.length === 0) {
    return (
      <>
        <PageHeader title="Oefenen" />
        <EmptyState
          icon={<GalleryHorizontalEnd size={24} />}
          title="Eerst een lijst nodig"
          text="Maak een woordenlijst of sla een startlijst op. Daarna kun je hier oefenen."
          action={<ButtonLink to="/lijsten">Naar Mijn lijsten</ButtonLink>}
        />
      </>
    );
  }

  const chosen = lists.filter((l) => selected.includes(l.id));
  const total = chosen.reduce((s, l) => s + (counts.get(l.id) ?? 0), 0);
  const first = chosen[0];
  const dirLabel = (d: Direction) =>
    first ? `${getLanguage(d === 'lr' ? first.langLeft : first.langRight).name} → ${getLanguage(d === 'lr' ? first.langRight : first.langLeft).name}` : d;
  const cardCount = onlyHard ? (hardCount ?? 0) : total;

  const start = async () => {
    try {
      const id = await startSession({ listIds: selected, mode, direction, shuffle, onlyHard });
      navigate(`/oefenen/${id}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Starten lukte niet.');
    }
  };

  return (
    <>
      <PageHeader title="Oefenen" intro="Kies wat en hoe je wilt oefenen." />

      {open && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] bg-primary-soft p-4">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-primary-ink">Verder waar je was</p>
            <p className="text-sm text-ink-soft">
              {modeLabels[open.state.options.mode]}, nog {new Set(open.state.engine.queue).size} van {open.state.engine.cards.length} kaarten
            </p>
          </div>
          <Button icon={<Play size={18} aria-hidden="true" />} onClick={() => navigate(`/oefenen/${open.id}`)}>
            Verder
          </Button>
          <Button variant="ghost" size="icon" aria-label="Gepauzeerde oefening weggooien" onClick={() => void discardOpenSessions()}>
            <Trash2 size={18} />
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="mb-2 text-lg font-bold">Lijsten</h2>
          <ul className="flex max-h-[420px] flex-col gap-1.5 overflow-y-auto rounded-[var(--radius-card)] border border-line bg-surface p-2">
            {sorted.map((l) => (
              <li key={l.id}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-2 hover:bg-surface-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 shrink-0 accent-[var(--primary)]"
                    checked={selected.includes(l.id)}
                    onChange={(e) => setSelected(e.target.checked ? [...selected, l.id] : selected.filter((x) => x !== l.id))}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{l.title}</span>
                    <span className="block text-sm text-ink-soft">
                      {[l.book?.title, l.book?.chapter && `hoofdstuk ${l.book.chapter}`].filter(Boolean).join(', ') || `${getLanguage(l.langLeft).name} – ${getLanguage(l.langRight).name}`}
                      , {counts.get(l.id) ?? 0} woorden
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-5">
          <div>
            <h2 className="mb-2 text-lg font-bold">Manier van oefenen</h2>
            <div role="radiogroup" aria-label="Manier van oefenen" className="grid grid-cols-2 gap-2">
              {modes.map(({ id, icon: Icon, text }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={mode === id}
                  onClick={() => setMode(id)}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition-colors',
                    mode === id ? 'border-primary bg-primary-soft' : 'border-line bg-surface hover:border-ink-soft',
                  )}
                >
                  <Icon size={22} aria-hidden="true" className={mode === id ? 'text-primary-ink' : 'text-ink-soft'} />
                  <span className="font-bold">{modeLabels[id]}</span>
                  <span className="text-sm leading-snug text-ink-soft">{text}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-soft">Later erbij: {later.join(', ')}.</p>
          </div>

          <div>
            <h2 className="mb-2 font-bold">Richting</h2>
            <Choice
              label="Richting"
              value={direction}
              onChange={setDirection}
              options={[
                { id: 'lr', label: dirLabel('lr') },
                { id: 'rl', label: dirLabel('rl') },
                { id: 'mix', label: 'Door elkaar' },
              ]}
            />
          </div>

          <div className="rounded-[var(--radius-card)] border border-line bg-surface px-4 py-1">
            <Switch label="Husselen" description="Woorden in willekeurige volgorde." checked={shuffle} onChange={setShuffle} />
            <Switch
              label="Alleen moeilijke woorden"
              description={hardCount ? `${hardCount} woorden die je eerder fout had.` : 'Woorden die je eerder fout had. Nog geen.'}
              checked={onlyHard}
              onChange={setOnlyHard}
            />
          </div>

          <Button size="lg" disabled={cardCount === 0} onClick={() => void start()} icon={<Play size={20} aria-hidden="true" />}>
            Start met {cardCount} {cardCount === 1 ? 'woord' : 'woorden'}
          </Button>
        </section>
      </div>
    </>
  );
}
