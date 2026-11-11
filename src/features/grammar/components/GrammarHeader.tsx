import { NavLink } from 'react-router';
import { BookOpen, PenLine } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/cn';

const tabs = [
  { to: '/grammatica', label: 'Onderwerpen', icon: BookOpen },
  { to: '/werkwoorden', label: 'Werkwoorden', icon: PenLine },
];

/**
 * Kop van Grammatica: de titel, de twee tabbladen (uitleg per onderwerp en de werkwoordtrainer)
 * en een regel uitleg bij het gekozen tabblad.
 */
export function GrammarHeader({ intro }: { intro: string }) {
  return (
    <>
      <PageHeader title="Grammatica" />
      <nav aria-label="Onderdelen van Grammatica" className="mb-4">
        <ul className="flex gap-1 rounded-full border border-line bg-surface p-1 sm:inline-flex">
          {tabs.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex min-w-0 flex-1">
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  cn(
                    'flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-2 font-semibold whitespace-nowrap transition-colors sm:px-5',
                    isActive ? 'bg-primary-soft text-primary-ink' : 'text-ink-soft hover:bg-surface-2 hover:text-ink',
                  )
                }
              >
                {/* Op heel smalle telefoons is er alleen plek voor de tekst. */}
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" className="shrink-0 max-[379px]:hidden" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mb-5 max-w-[60ch] text-ink-soft">{intro}</p>
    </>
  );
}
