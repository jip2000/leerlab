import { NavLink } from 'react-router';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';
import { navGroups, navItems } from './nav';

/** Zijbalk links, alleen op grotere schermen. */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
      <NavLink to="/" className="mb-7 rounded-xl px-2 py-1" aria-label="Woordwerk, naar Home">
        <Logo />
      </NavLink>
      <nav aria-label="Hoofdmenu" className="flex flex-1 flex-col gap-6 overflow-y-auto">
        {navGroups.map((g) => (
          <div key={g.id}>
            <h2 className="mb-1.5 px-3 text-[13px] font-semibold text-ink-soft">{g.label}</h2>
            <ul className="flex flex-col gap-0.5">
              {navItems
                .filter((i) => i.group === g.id)
                .map(({ path, label, icon: Icon }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      end={path === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex h-11 items-center gap-3 rounded-[var(--radius-control)] px-3 text-[15px] font-semibold transition-colors',
                          isActive ? 'bg-primary-soft text-primary-ink' : 'text-ink-soft hover:bg-surface-2 hover:text-ink',
                        )
                      }
                    >
                      <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
                      {label}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
