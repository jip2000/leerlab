import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Ellipsis, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { navItems } from './nav';

const tabClass = (active: boolean) =>
  cn(
    'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11.5px] font-semibold transition-colors',
    active ? 'text-primary-ink' : 'text-ink-soft',
  );

/** Tabbalk onderaan op mobiel, met een "Meer"-knop voor de overige pagina's. */
export function TabBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const tabs = navItems.filter((i) => i.tab);
  const more = navItems.filter((i) => !i.tab);
  const moreActive = more.some((i) => pathname.startsWith(i.path));

  return (
    <>
      <nav
        aria-label="Hoofdmenu"
        className="tabbar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto flex max-w-xl">
          {tabs.map(({ path, label, icon: Icon }) => (
            <li key={path} className="flex flex-1">
              <NavLink to={path} end={path === '/'} className={({ isActive }) => tabClass(isActive)}>
                {({ isActive }) => (
                  <>
                    <span className={cn('grid h-7 w-12 place-items-center rounded-full transition-colors', isActive && 'bg-primary-soft')}>
                      <Icon size={21} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    {label === 'Mijn lijsten' ? 'Lijsten' : label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
          <li className="flex flex-1">
            <button
              type="button"
              className={tabClass(moreActive)}
              aria-expanded={open}
              aria-controls="meer-menu"
              onClick={() => setOpen(true)}
            >
              <span className={cn('grid h-7 w-12 place-items-center rounded-full', moreActive && 'bg-primary-soft')}>
                <Ellipsis size={21} strokeWidth={2.2} aria-hidden="true" />
              </span>
              Meer
            </button>
          </li>
        </ul>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="meer-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Meer pagina's"
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-surface px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-soft lg:hidden"
              initial={reduce ? { opacity: 0 } : { y: '100%' }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            >
              <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-line" aria-hidden="true" />
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-bold">Meer</h2>
                <button
                  type="button"
                  autoFocus
                  className="grid h-11 w-11 place-items-center rounded-xl hover:bg-surface-2"
                  onClick={() => setOpen(false)}
                  aria-label="Sluiten"
                >
                  <X size={22} />
                </button>
              </div>
              <ul className="grid grid-cols-3 gap-2">
                {more.map(({ path, label, icon: Icon }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border text-center text-[13px] font-semibold',
                          isActive ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line bg-bg text-ink',
                        )
                      }
                    >
                      <Icon size={24} strokeWidth={2.1} aria-hidden="true" />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

