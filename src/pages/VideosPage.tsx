import { SquarePlay } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export function VideosPage() {
  return (
    <>
      <PageHeader title="Video's" intro="Uitlegvideo's per vak en hoofdstuk, met je eigen aantekeningen." />
      <EmptyState
        icon={<SquarePlay size={24} />}
        title="Nog geen video's"
        text="Straks plak je hier een YouTube-link. De video speelt dan in Woordwerk zelf, naast je aantekeningen. Dit komt in fase 9."
      />
    </>
  );
}
