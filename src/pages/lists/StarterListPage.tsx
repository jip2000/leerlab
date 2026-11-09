import { useNavigate, useParams } from 'react-router';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { Button } from '@/components/ui/Button';
import { getLanguage } from '@/data/languages';
import { getStarterList } from '@/data/starter';
import { createList } from '@/features/lists/repo';
import { WordTable } from '@/features/lists/components/WordTable';
import { toast } from '@/lib/toast';
import { NotFoundPage } from '../NotFoundPage';

export function StarterListPage() {
  const starter = getStarterList(useParams().id ?? '');
  const navigate = useNavigate();
  if (!starter) return <NotFoundPage />;
  const lang = getLanguage(starter.lang);
  const words = starter.words.map(([left, right, article]) => ({ left, right, article }));

  return (
    <>
      <BackLink to="/lijsten">Mijn lijsten</BackLink>
      <PageHeader title={`${lang.name}: ${starter.theme}`} intro={`Startlijst met ${words.length} woorden. Sla hem op om ermee te oefenen.`} />
      <Button
        size="lg"
        className="mb-5"
        icon={<Download size={20} aria-hidden="true" />}
        onClick={async () => {
          const id = await createList(
            { title: `${lang.name}: ${starter.theme}`, langLeft: starter.lang, langRight: 'nl', tags: ['startlijst'], starterId: starter.id },
            words,
          );
          toast('Opgeslagen in Mijn lijsten');
          navigate(`/lijsten/${id}`);
        }}
      >
        Opslaan in mijn lijsten
      </Button>
      <WordTable words={words} langLeft={starter.lang} langRight="nl" />
    </>
  );
}
