import { useParams } from 'react-router';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { BackLink } from '@/components/ui/BackLink';
import { useLists, useWordCounts } from '@/features/lists/hooks';
import { bookKey, compareChapters, yearLevelLabel } from '@/features/lists/books';
import { ListCard } from '@/features/lists/components/ListCard';
import { sortLists } from '@/features/lists/sort';
import { NotFoundPage } from '../NotFoundPage';

/** Eén boek (in een leerjaar en niveau), met de lijsten per hoofdstuk. */
export function BookPage() {
  const key = decodeURIComponent(useParams().key ?? '');
  const lists = useLists();
  const counts = useWordCounts();
  if (!lists || !counts) return null;

  const inBook = lists.filter((l) => l.book?.title && bookKey(l.book) === key);
  const book = inBook[0]?.book;
  if (!book) return <NotFoundPage />;

  const chapters = new Map<string, typeof inBook>();
  for (const l of inBook) {
    const ch = l.book?.chapter?.trim() || '';
    chapters.set(ch, [...(chapters.get(ch) ?? []), l]);
  }
  const ordered = [...chapters.entries()].sort(([a], [b]) => (a === '' ? 1 : b === '' ? -1 : compareChapters(a, b)));

  const params = new URLSearchParams({ boek: book.title, ...(book.year ? { jaar: String(book.year) } : {}), ...(book.level ? { niveau: book.level } : {}) });
  const foreign = inBook[0]!.langLeft === 'nl' ? inBook[0]!.langRight : inBook[0]!.langLeft;
  params.set('taal', foreign);

  return (
    <>
      <BackLink to="/lijsten">Mijn lijsten</BackLink>
      <PageHeader
        title={book.title}
        intro={yearLevelLabel(book) || undefined}
        actions={
          <ButtonLink to={`/lijsten/nieuw?${params}`}>
            <Plus size={18} aria-hidden="true" /> Lijst toevoegen
          </ButtonLink>
        }
      />
      <div className="flex flex-col gap-7">
        {ordered.map(([chapter, ls]) => (
          <section key={chapter}>
            <h2 className="mb-2.5 text-lg font-extrabold">{chapter ? `Hoofdstuk ${chapter}` : 'Zonder hoofdstuk'}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {sortLists(ls, 'naam').map((l) => (
                <li key={l.id}>
                  <ListCard list={l} count={counts.get(l.id) ?? 0} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
