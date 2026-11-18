import { useMemo, useState } from 'react';
import { WoordenTabs } from '@/components/layout/WoordenTabs';
import { Link } from 'react-router';
import { BookMarked, ChevronRight, FolderPlus, Globe, Library, Plus, Upload } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Field';
import { getLanguage, type LanguageCode } from '@/data/languages';
import type { BookInfo, WordList } from '@/db/types';
import { useFolders, useLists, useWordCounts } from '@/features/lists/hooks';
import { createFolder } from '@/features/lists/repo';
import { bookKey, yearLevelLabel } from '@/features/lists/books';
import { folderIcon } from '@/features/lists/folderIcons';
import { ListCard } from '@/features/lists/components/ListCard';
import { FolderForm } from '@/features/lists/components/FolderForm';
import { sortLists, type Sort } from '@/features/lists/sort';


const foreignOf = (l: WordList): LanguageCode => (l.langLeft === 'nl' ? l.langRight : l.langLeft);

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-[-0.015em]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ListsPage() {
  const lists = useLists();
  const folders = useFolders();
  const counts = useWordCounts();
  const [sort, setSort] = useState<Sort>('nieuw');
  const [newFolder, setNewFolder] = useState(false);

  const books = useMemo(() => {
    const map = new Map<string, { book: BookInfo; lang: LanguageCode; lists: WordList[] }>();
    for (const l of lists ?? []) {
      if (!l.book?.title) continue;
      const key = bookKey(l.book);
      const entry = map.get(key) ?? { book: l.book, lang: foreignOf(l), lists: [] };
      entry.lists.push(l);
      map.set(key, entry);
    }
    return [...map.entries()].sort((a, b) => a[1].book.title.localeCompare(b[1].book.title, 'nl'));
  }, [lists]);

  if (!lists || !folders || !counts) return null; // database laadt nog (duurt een paar milliseconden)

  const loose = sortLists(lists.filter((l) => !l.book?.title && !l.folderId), sort);
  const empty = lists.length === 0;

  return (
    <>
      <WoordenTabs
        actions={
          <>
            <ButtonLink to="/lijsten/importeren" variant="secondary">
              <Upload size={18} aria-hidden="true" /> Importeren
            </ButtonLink>
            <ButtonLink to="/lijsten/nieuw">
              <Plus size={18} aria-hidden="true" /> Nieuwe lijst
            </ButtonLink>
          </>
        }
      />

      {empty && (
        <EmptyState
          icon={<Library size={24} />}
          title="Nog geen lijsten"
          text="Maak een lijst voor het hoofdstuk dat je nu leert. Je kunt de woorden typen, of plakken uit een bestand. Heeft een klasgenoot de lijst al gemaakt? Vraag dan om de deellink."
        />
      )}

      {books.length > 0 && (
        <Section title="Mijn boeken">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {books.map(([key, { book, lang, lists: ls }]) => (
              <li key={key}>
                <Link
                  to={`/lijsten/boek/${encodeURIComponent(key)}`}
                  className="flex h-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-primary"
                >
                  <span
                    className="grid h-14 w-11 shrink-0 place-items-center rounded-r-lg rounded-l-sm text-white shadow-soft"
                    style={{ backgroundColor: getLanguage(lang).color }}
                    aria-hidden="true"
                  >
                    <BookMarked size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{book.title}</span>
                    <span className="block text-sm text-ink-soft">
                      {[getLanguage(lang).name, yearLevelLabel(book)].filter(Boolean).join(', ')}
                    </span>
                    <span className="block text-sm text-ink-soft">
                      {ls.length} {ls.length === 1 ? 'lijst' : 'lijsten'}
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        title="Mappen"
        action={
          !newFolder && (
            <Button variant="ghost" icon={<FolderPlus size={18} aria-hidden="true" />} onClick={() => setNewFolder(true)}>
              Nieuwe map
            </Button>
          )
        }
      >
        {newFolder && (
          <div className="mb-3">
            <FolderForm
              submitLabel="Map maken"
              onCancel={() => setNewFolder(false)}
              onSubmit={async (v) => {
                await createFolder(v);
                setNewFolder(false);
              }}
            />
          </div>
        )}
        {folders.length === 0 && !newFolder ? (
          <p className="text-ink-soft">Mappen helpen je lijsten te ordenen per vak, bijvoorbeeld voor lijsten zonder boek.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((f) => {
              const Icon = folderIcon(f.icon);
              const n = lists.filter((l) => l.folderId === f.id).length;
              return (
                <li key={f.id}>
                  <Link
                    to={`/lijsten/map/${f.id}`}
                    className="flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ backgroundColor: f.color }}>
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold">{f.name}</span>
                      <span className="block text-sm text-ink-soft">
                        {n} {n === 1 ? 'lijst' : 'lijsten'}
                      </span>
                    </span>
                    <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {loose.length > 0 && (
        <Section
          title="Overige lijsten"
          action={
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              Sorteren
              <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="w-auto">
                <option value="nieuw">Laatst gewijzigd</option>
                <option value="naam">Naam</option>
              </Select>
            </label>
          }
        >
          <ul className="grid gap-2 sm:grid-cols-2">
            {loose.map((l) => (
              <li key={l.id}>
                <ListCard list={l} count={counts.get(l.id) ?? 0} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <StarterSection />
    </>
  );
}

/** Verwijzing naar het vakje "Nieuwe taal proberen". */
function StarterSection() {
  return (
    <Section title="Een nieuwe taal proberen?">
      <p className="mb-3 max-w-[60ch] text-ink-soft">Kant-en-klare startlijsten voor talen die je niet op school krijgt, zoals Zweeds, Italiaans of Pools.</p>
      <ButtonLink to="/nieuwe-taal" variant="secondary">
        <Globe size={18} aria-hidden="true" /> Naar Nieuwe taal proberen
      </ButtonLink>
    </Section>
  );
}
