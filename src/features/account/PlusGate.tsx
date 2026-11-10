import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { plusFeatures, usePlusAccess, type Feature } from '@/lib/plan';

/** Laat de inhoud zien als je toegang hebt, anders uitleg over Plus. */
export function PlusGate({ feature, children }: { feature: Feature; children: ReactNode }) {
  const ok = usePlusAccess(feature);
  if (ok) return <>{children}</>;
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-[28px] border border-line bg-surface p-8 text-center shadow-soft">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-marker text-marker-ink"><Sparkles size={28} aria-hidden="true" /></span>
      <h1 className="text-2xl font-extrabold">Dit hoort bij Plus</h1>
      <p className="text-ink-soft">{plusFeatures[feature]}. Met Woordwerk Plus kun je dit gebruiken.</p>
      <ButtonLink to="/plus">Bekijk Plus</ButtonLink>
    </div>
  );
}

export const gated = (feature: Feature, el: ReactNode) => <PlusGate feature={feature}>{el}</PlusGate>;
