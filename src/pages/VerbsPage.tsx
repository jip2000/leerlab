import { PenLine } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LanguageBadge } from '@/components/ui/LanguageBadge';
import type { LanguageCode } from '@/data/languages';

const first: LanguageCode[] = ['fr', 'de', 'en', 'es'];

export function VerbsPage() {
  return (
    <>
      <PageHeader title="Werkwoorden" intro="Vervoegen oefenen: los, als rijtje, in een zin of omgekeerd." />
      <EmptyState
        icon={<PenLine size={24} />}
        title="De werkwoordtrainer komt in fase 5"
        text="We beginnen met Frans, Duits, Engels en Spaans. Je kiest zelf welke werkwoorden, tijden en personen je oefent."
        action={
          <div className="flex gap-2">
            {first.map((c) => (
              <LanguageBadge key={c} code={c} />
            ))}
          </div>
        }
      />
    </>
  );
}
