import { NavLink } from 'react-router';
import { ClipboardList, Play } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/cn';

/**
 * Kop van "Woorden oefenen": één plek voor je woordenlijsten en het oefenen ervan.
 * Staat bovenaan Mijn woordenlijsten (#/lijsten) en Oefenen (#/oefenen).
 */
export function WoordenTabs({ actions }: { actions?: React.ReactNode }) {
  const tabs = [
    { to: '/lijsten', label: 'Mijn woordenlijsten', sub: 'Lijsten maken en bekijken', icon: ClipboardList },
    { to: '/oefenen', label: 'Oefenen', sub: 'Kies lijsten en start', icon: Play },
  ];
  return (
    <>
      <PageHeader title="Woorden oefenen" intro="Maak een woordenlijst en oefen hem." actions={actions} />
      <nav aria-label="Woorden oefenen" className="mb-6 grid grid-cols-2 gap-3">
        {tabs.map(({ to, label, sub, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-start gap-1 rounded-[var(--radius-card)] border-2 p-4 transition-colors sm:flex-row sm:items-center sm:gap-3',
                isActive ? 'border-primary bg-primary-soft' : 'border-line bg-surface hover:border-primary',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', isActive ? 'bg-primary text-on-primary' : 'bg-surface-2 text-ink-soft')}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-lg font-extrabold">{label}</span>
                  <span className="block text-sm text-ink-soft">{sub}</span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
