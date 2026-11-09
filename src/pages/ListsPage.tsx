import { Library } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export function ListsPage() {
  return (
    <>
      <PageHeader title="Mijn lijsten" intro="Al je woordenlijsten, in mappen per vak en hoofdstuk." />
      <EmptyState
        icon={<Library size={24} />}
        title="Nog geen lijsten"
        text="Straks maak je hier een lijst, plak je woorden uit je boek of Excel, of importeer je een CSV-bestand. Dit bouwen we in fase 2."
      />
    </>
  );
}
