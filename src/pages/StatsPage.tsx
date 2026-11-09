import { ChartColumn } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export function StatsPage() {
  return (
    <>
      <PageHeader title="Statistieken" intro="Hoeveel je oefent, wat je al kent en welke badges je hebt." />
      <EmptyState
        icon={<ChartColumn size={24} />}
        title="Nog niets te tellen"
        text="Na je eerste oefening zie je hier grafieken van je oefentijd, je moeilijkste woorden en je badges. Dit komt in fase 10."
      />
    </>
  );
}
