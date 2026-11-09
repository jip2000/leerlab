import { CalendarDays } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export function PlannerPage() {
  return (
    <>
      <PageHeader title="Planner" intro="Zet je toetsen erin en krijg elke dag een stukje om te leren." />
      <EmptyState
        icon={<CalendarDays size={24} />}
        title="Nog geen toetsen gepland"
        text="Straks kies je een vak, een datum en de lijsten voor je toets. Woordwerk verdeelt de woorden dan over de dagen ervoor. Dit komt in fase 9."
      />
    </>
  );
}
