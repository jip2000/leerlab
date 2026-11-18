import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { BookOpen, ChevronRight, PenLine } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { LanguageBadge } from '@/components/ui/LanguageBadge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { isExtraTaal, languages, type LanguageCode } from '@/data/languages';
import { starterLists } from '@/data/starter';
import { verbEngines } from '@/features/verbs/registry';
import { cn } from '@/lib/cn';

const extra = languages.filter((l) => isExtraTaal(l.code));

/**
 * NIEUWE TAAL PROBEREN: voor talen die je niet op school krijgt.
 * Kies een taal → startlijsten met de eerste woorden, en de grammatica en werkwoorden.
 */
export function NewLanguagePage() {
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get('taal') as LanguageCode | null;
  const [picked, setPicked] = useState<LanguageCode | null>(fromUrl && extra.some((l) => l.code === fromUrl) ? fromUrl : null);
  const lang = extra.find((l) => l.code === picked);
  const pick = (code: LanguageCode) => {
    setPicked(code);
    setParams({ taal: code }, { replace: true });
  };
  const lists = lang ? starterLists.filter((s) => s.lang === lang.code) : [];

  return (
    <>
      <PageHeader title="Nieuwe taal proberen" intro="Zin in een taal die je niet op school krijgt? Kies er een en begin met de eerste woorden." />

      <h2 className="mb-2 text-lg font-bold">1. Kies een taal</h2>
      <ul className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" role="list">
        {extra.map((l) => (
          <li key={l.code}>
            <button
              type="button"
              aria-pressed={picked === l.code}
              onClick={() => pick(l.code)}
              className={cn(
                'flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left transition-colors',
                picked === l.code ? 'border-primary bg-primary-soft' : 'border-line bg-surface hover:border-primary',
              )}
            >
              <LanguageBadge code={l.code} />
              <span className="font-bold">{l.name}</span>
            </button>
          </li>
        ))}
      </ul>

      {lang && (
        <section aria-label={`${lang.name} proberen`}>
          <h2 className="mb-2 text-lg font-bold">2. Begin met {lang.name}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
              <h3 className="mb-1 font-bold">De eerste woorden</h3>
              {lists.length ? (
                <>
                  <p className="mb-3 text-sm text-ink-soft">Kies een startlijst, sla hem op en oefen meteen.</p>
                  <ul className="flex flex-col gap-2">
                    {lists.map((s) => (
                      <li key={s.id}>
                        <Link to={`/lijsten/start/${s.id}`} className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-bg px-4 py-2 transition-colors hover:border-primary">
                          <span className="flex-1">
                            <span className="block font-semibold">{s.theme}</span>
                            <span className="block text-sm text-ink-soft">{s.words.length} woorden</span>
                          </span>
                          <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="mb-3 text-sm text-ink-soft">Voor {lang.name} zijn er nog geen startlijsten. Maak zelf een lijst met je eerste woorden.</p>
                  <ButtonLink to="/lijsten/nieuw">Nieuwe lijst maken</ButtonLink>
                </>
              )}
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
              <h3 className="mb-1 font-bold">Grammatica{verbEngines[lang.code] ? ' en werkwoorden' : ''}</h3>
              <p className="mb-3 text-sm text-ink-soft">
                {verbEngines[lang.code] ? 'Oefen de belangrijkste werkwoorden en lees de basisregels.' : 'Lees de basisregels en oefen ze.'}
              </p>
              <ButtonLink to={`/grammatica/${lang.code}`}>
                {verbEngines[lang.code] ? <PenLine size={18} aria-hidden="true" /> : <BookOpen size={18} aria-hidden="true" />}
                Naar {lang.name}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
