import { Link } from 'react-router';
import { CalendarDays, Flame, Layers, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useSettings } from '@/lib/settings';

function greeting(hour: number) {
  if (hour < 6) return 'Goedenacht';
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

// In fase 4 komen hier echte cijfers uit de database.
const dueToday = 0;
const streak = 0;
const doneToday = 0;

export function HomePage() {
  const dagdoel = useSettings((s) => s.dagdoel);
  const unit = dagdoel.type === 'minuten' ? 'min' : 'woorden';

  return (
    <div className="flex flex-col gap-5">
      <header className="mb-1">
        <h1 className="text-[30px] leading-[1.15] font-extrabold tracking-[-0.025em] sm:text-[38px]">
          <span className="marker">{greeting(new Date().getHours())}!</span>
        </h1>
        <p className="mt-2 text-ink-soft">Hier zie je wat je vandaag kunt doen.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <Card tone="mint" className="flex flex-col justify-between gap-5">
          <div>
            <h2 className="font-semibold text-primary-ink">Vandaag herhalen</h2>
            <p className="mt-1 text-[44px] leading-none font-extrabold tracking-[-0.03em] text-ink">
              {dueToday} <span className="text-xl font-bold text-ink-soft">woorden</span>
            </p>
            <p className="mt-3 max-w-[40ch] text-ink-soft">
              Je hebt nog geen lijsten. Maak er een en Woordwerk houdt bij welke woorden je wanneer moet herhalen.
            </p>
          </div>
          <Link
            to="/lijsten"
            className="inline-flex h-12 w-fit items-center gap-2 rounded-[var(--radius-control)] bg-primary px-5 font-semibold text-on-primary hover:bg-primary-hover"
          >
            <Plus size={20} aria-hidden="true" /> Maak je eerste lijst
          </Link>
        </Card>

        <Card className="flex items-center gap-5">
          <ProgressRing value={doneToday / dagdoel.aantal} label={`Dagdoel: ${doneToday} van ${dagdoel.aantal} ${unit}`}>
            <span className="text-xl font-extrabold">
              {doneToday}
              <span className="text-sm font-semibold text-ink-soft">/{dagdoel.aantal}</span>
            </span>
          </ProgressRing>
          <div>
            <h2 className="font-bold">Dagdoel</h2>
            <p className="text-ink-soft">
              {dagdoel.aantal} {dagdoel.type} oefenen. Aanpassen kan bij{' '}
              <Link to="/instellingen" className="font-semibold text-primary-ink underline underline-offset-2">
                Instellingen
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-marker text-marker-ink">
            <Flame size={24} aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold">{streak} dagen op rij</h2>
            <p className="text-sm text-ink-soft">Oefen vandaag en start je reeks.</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 flex items-center gap-2 font-bold">
            <Layers size={18} aria-hidden="true" className="text-ink-soft" /> Verder waar je was
          </h2>
          <p className="text-sm text-ink-soft">Hier verschijnt je laatste oefening, zodat je in één tik verdergaat.</p>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <h2 className="mb-1 flex items-center gap-2 font-bold">
            <CalendarDays size={18} aria-hidden="true" className="text-ink-soft" /> Komende toetsen
          </h2>
          <p className="text-sm text-ink-soft">
            Nog geen toetsen.{' '}
            <Link to="/planner" className="font-semibold text-primary-ink underline underline-offset-2">
              Zet er een in de planner
            </Link>{' '}
            en je krijgt een leerschema.
          </p>
        </Card>
      </div>
    </div>
  );
}
