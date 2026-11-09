import { Layers } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

const modes = ['Flashcards', 'Typen', 'Meerkeuze', 'Toets', 'Luisteren', 'Koppelen', 'Snel-ronde', 'Leren'];

export function PracticePage() {
  return (
    <>
      <PageHeader title="Oefenen" intro="Kies een of meer lijsten en een manier van oefenen." />
      <EmptyState
        icon={<Layers size={24} />}
        title="Eerst een lijst nodig"
        text="Zodra je een woordenlijst hebt, kun je die hier op verschillende manieren oefenen. De eerste vier modi komen in fase 3."
      />
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Oefenmodi die eraan komen">
        {modes.map((m) => (
          <li key={m} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink-soft">
            {m}
          </li>
        ))}
      </ul>
    </>
  );
}
