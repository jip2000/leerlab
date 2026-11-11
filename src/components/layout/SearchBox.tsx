import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { Search } from 'lucide-react';
import { search } from '@/lib/search';
import { cn } from '@/lib/cn';
import { searchPages } from './nav';

/** Zoekbalk bovenaan. Sneltoets op desktop: "/". */
export function SearchBox({ autoFocus, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const listId = useId();
  // Lijsten en woorden pas laden als je gaat zoeken.
  const data = useLiveQuery(async () => (open ? { lists: await db.lists.toArray(), words: await db.words.toArray() } : undefined), [open]);
  const results = useMemo(() => search(query, searchPages, 10, data), [query, data]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest('input, textarea, [contenteditable="true"]');
      if (e.key === '/' && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (to: string) => {
    navigate(to);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
    onDone?.();
  };

  const showList = open && query.trim().length > 0;

  return (
    <div className="relative w-full">
      <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-label="Zoeken"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        autoFocus={autoFocus}
        placeholder="Zoek in lijsten, woorden en grammatica"
        className="h-11 w-full rounded-full border border-line bg-surface pr-12 pl-10 text-[15px] text-ink placeholder:text-ink-soft focus-visible:border-primary"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === 'Enter' && results[active]) {
            go(results[active].to);
          } else if (e.key === 'Escape') {
            setQuery('');
            onDone?.();
          }
        }}
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-line px-1.5 text-xs text-ink-soft lg:block">
        /
      </kbd>
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-[60vh] overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-soft"
        >
          {results.length === 0 && <li className="px-3 py-3 text-ink-soft">Niets gevonden voor "{query}".</li>}
          {results.map((r, i) => (
            <li
              key={`${r.to}-${r.title}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(r.to)}
              onMouseEnter={() => setActive(i)}
              className={cn('cursor-pointer rounded-xl px-3 py-2.5', i === active && 'bg-surface-2')}
            >
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-ink-soft">{r.subtitle}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
