import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { folderColors, folderIcons } from '../folderIcons';

export interface FolderValues {
  name: string;
  color: string;
  icon: string;
}

/** Formulier om een map te maken of te wijzigen (naam, kleur, icoon). */
export function FolderForm({ initial, submitLabel, onSubmit, onCancel }: {
  initial?: FolderValues;
  submitLabel: string;
  onSubmit: (v: FolderValues) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState<FolderValues>(initial ?? { name: '', color: folderColors[0]!, icon: 'talen' });
  return (
    <form
      className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (v.name.trim()) onSubmit({ ...v, name: v.name.trim() });
      }}
    >
      <Field label="Naam van de map">
        <Input autoFocus value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder="Bijvoorbeeld: Frans" required />
      </Field>
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Kleur</legend>
        <div className="flex flex-wrap gap-2">
          {folderColors.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Kleur ${c}`}
              aria-pressed={v.color === c}
              onClick={() => setV({ ...v, color: c })}
              className="grid h-11 w-11 place-items-center rounded-full text-white"
              style={{ backgroundColor: c }}
            >
              {v.color === c && <Check size={20} />}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Icoon</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(folderIcons).map(([name, Icon]) => (
            <button
              key={name}
              type="button"
              aria-label={`Icoon ${name}`}
              aria-pressed={v.icon === name}
              onClick={() => setV({ ...v, icon: name })}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-xl border',
                v.icon === name ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line text-ink-soft',
              )}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="flex gap-2">
        <Button type="submit">{submitLabel}</Button>
        <Button variant="ghost" onClick={onCancel}>
          Annuleren
        </Button>
      </div>
    </form>
  );
}
