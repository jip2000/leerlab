import { useId } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

/** Aan/uit-schakelaar met label (hele rij is klikbaar). */
export function Switch({ label, description, checked, onChange }: Props) {
  const id = useId();
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 py-2">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-semibold">{label}</span>
        {description && <span className="block text-sm text-ink-soft">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-8 w-13 shrink-0 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-line',
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-5',
          )}
        />
        <span className="sr-only">{checked ? 'Aan' : 'Uit'}</span>
      </button>
    </div>
  );
}
