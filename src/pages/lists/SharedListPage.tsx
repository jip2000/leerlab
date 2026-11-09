import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { getLanguage } from '@/data/languages';
import { createList } from '@/features/lists/repo';
import { WordTable } from '@/features/lists/components/WordTable';
import { yearLevelLabel } from '@/features/lists/books';
import { decodeSharedList, type SharedList } from '@/lib/share';
import { toast } from '@/lib/toast';

const opt = (v?: string) => (v ? v : undefined);

/** Opent een gedeelde lijst van een klasgenoot. */
export function SharedListPage() {
  const [params] = useSearchParams();
  const [shared, setShared] = useState<SharedList | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('d');
    if (!code) return setError('Deze link bevat geen woordenlijst.');
    decodeSharedList(code)
      .then(setShared)
      .catch(() => setError('Deze link is kapot of niet compleet. Vraag je klasgenoot om de link opnieuw te sturen.'));
  }, [params]);

  if (error) return <PageHeader title="Lijst openen lukt niet" intro={error} />;
  if (!shared) return null;

  const words = shared.words.map(([left, right, article, extraForms, example, note]) => ({
    left, right, article: opt(article), extraForms: opt(extraForms), example: opt(example), note: opt(note),
  }));
  const book = shared.book ? [shared.book.title, yearLevelLabel(shared.book), shared.book.chapter && `hoofdstuk ${shared.book.chapter}`].filter(Boolean).join(' ') : '';

  return (
    <>
      <PageHeader
        title={shared.title}
        intro={[`Gedeelde lijst: ${getLanguage(shared.langLeft).name} – ${getLanguage(shared.langRight).name}`, book, `${words.length} woorden`].filter(Boolean).join(', ')}
      />
      <Button
        size="lg"
        className="mb-5"
        icon={<Download size={20} aria-hidden="true" />}
        onClick={async () => {
          const id = await createList({ title: shared.title, langLeft: shared.langLeft, langRight: shared.langRight, book: shared.book, tags: [] }, words);
          toast('Lijst opgeslagen in Mijn lijsten');
          navigate(`/lijsten/${id}`, { replace: true });
        }}
      >
        Opslaan in mijn lijsten
      </Button>
      <WordTable words={words} langLeft={shared.langLeft} langRight={shared.langRight} />
    </>
  );
}
