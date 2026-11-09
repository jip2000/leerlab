import { Camera } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export function ScanPage() {
  return (
    <>
      <PageHeader title="Foto scannen" intro="Maak een foto van de woordjes in je boek en maak er flashcards van." />
      <EmptyState
        icon={<Camera size={24} />}
        title="Scannen komt in fase 7"
        text="Je maakt een foto, snijdt het stuk met woordjes bij, en Woordwerk leest de tekst. Daarna controleer je alles voordat je het opslaat."
      />
    </>
  );
}
