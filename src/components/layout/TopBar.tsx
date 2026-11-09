import { useState } from 'react';
import { Link } from 'react-router';
import { Search, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  const [mobileSearch, setMobileSearch] = useState(false);
  return (
    <div className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
      {/* Mobiel */}
      <div className="flex h-15 items-center gap-2 px-4 lg:hidden">
        {mobileSearch ? (
          <>
            <SearchBox autoFocus onDone={() => setMobileSearch(false)} />
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-surface-2"
              onClick={() => setMobileSearch(false)}
              aria-label="Zoeken sluiten"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <>
            <Link to="/" aria-label="Woordwerk, naar Home" className="rounded-xl">
              <Logo />
            </Link>
            <div className="ml-auto flex items-center">
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-2 hover:text-ink"
                onClick={() => setMobileSearch(true)}
                aria-label="Zoeken"
              >
                <Search size={20} strokeWidth={2.2} />
              </button>
              <ThemeToggle />
            </div>
          </>
        )}
      </div>
      {/* Desktop */}
      <div className="mx-auto hidden h-18 max-w-5xl items-center gap-3 px-8 lg:flex">
        <div className="max-w-md flex-1">
          <SearchBox />
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
