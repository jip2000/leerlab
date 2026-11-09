import { Monitor, Moon, Sun } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { useSettings, type CheckRules, type ThemeChoice } from '@/lib/settings';
import { cn } from '@/lib/cn';

const themes: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: 'systeem', label: 'Systeem', icon: Monitor },
  { value: 'licht', label: 'Licht', icon: Sun },
  { value: 'donker', label: 'Donker', icon: Moon },
];

const rules: { key: keyof CheckRules; label: string; description: string }[] = [
  { key: 'ignoreCase', label: 'Hoofdletters negeren', description: '"paris" is dan ook goed voor "Paris".' },
  { key: 'ignoreAccents', label: 'Accenten negeren', description: 'Uit: "ecole" telt als bijna goed voor "école".' },
  { key: 'ignorePunctuation', label: 'Leestekens en spaties negeren', description: 'Aan het begin en eind van je antwoord.' },
  { key: 'allowTypos', label: 'Kleine typfouten', description: 'Eén letter fout = bijna goed, jij kiest of het telt.' },
  { key: 'countArticle', label: 'Lidwoord telt mee', description: 'Bijvoorbeeld "la maison" in plaats van "maison".' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="divide-y divide-line py-2">
      <h2 className="pt-2 pb-3 text-lg font-bold">{title}</h2>
      {children}
    </Card>
  );
}

export function SettingsPage() {
  const s = useSettings();

  return (
    <>
      <PageHeader title="Instellingen" intro="Alles wordt alleen op dit apparaat bewaard." />
      <div className="flex flex-col gap-4">
        <Section title="Thema">
          <div role="radiogroup" aria-label="Thema" className="grid grid-cols-3 gap-2 py-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={s.thema === value}
                onClick={() => s.setThema(value)}
                className={cn(
                  'flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 font-semibold transition-colors',
                  s.thema === value ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line text-ink-soft hover:text-ink',
                )}
              >
                <Icon size={22} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Dagdoel">
          <div className="flex flex-wrap items-center gap-3 py-3">
            <label className="flex items-center gap-2 font-semibold">
              <span className="sr-only">Aantal</span>
              <input
                type="number"
                min={1}
                max={500}
                value={s.dagdoel.aantal}
                onChange={(e) => s.update({ dagdoel: { ...s.dagdoel, aantal: Math.max(1, Number(e.target.value) || 1) } })}
                className="h-11 w-24 rounded-[var(--radius-control)] border border-line bg-surface px-3 text-ink"
              />
            </label>
            <label className="flex items-center">
              <span className="sr-only">Eenheid</span>
              <select
                value={s.dagdoel.type}
                onChange={(e) => s.update({ dagdoel: { ...s.dagdoel, type: e.target.value as 'minuten' | 'woorden' } })}
                className="h-11 rounded-[var(--radius-control)] border border-line bg-surface px-3 font-semibold text-ink"
              >
                <option value="minuten">minuten per dag</option>
                <option value="woorden">woorden per dag</option>
              </select>
            </label>
          </div>
        </Section>

        <Section title="Geluid en voorlezen">
          <Switch label="Geluidjes" description="Een geluidje bij goed en fout." checked={s.geluid} onChange={(geluid) => s.update({ geluid })} />
          <Switch
            label="Automatisch voorlezen"
            description="Woorden worden voorgelezen tijdens het oefenen."
            checked={s.voorlezen}
            onChange={(voorlezen) => s.update({ voorlezen })}
          />
        </Section>

        <Section title="Nakijken">
          {rules.map((r) => (
            <Switch
              key={r.key}
              label={r.label}
              description={r.description}
              checked={s.nakijkregels[r.key]}
              onChange={(v) => s.update({ nakijkregels: { ...s.nakijkregels, [r.key]: v } })}
            />
          ))}
        </Section>

        <Section title="Back-up">
          <p className="py-3 text-ink-soft">Exporteren en importeren van al je gegevens komt in fase 11.</p>
        </Section>
      </div>
    </>
  );
}
