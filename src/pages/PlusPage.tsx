import { Check, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { plusFeatures, PLUS_ON } from '@/lib/plan';
import { useAccount } from '@/features/account/store';

const free = ['Woordenlijsten maken, plakken, importeren en delen', 'Flashcards, typen, meerkeuze, toets, leren, luisteren, koppelen, snel-ronde', 'Streak, XP, levels en badges', 'Grammatica-uitleg voor 19 talen', 'Offline werken en back-ups'];

export function PlusPage() {
  const plan = useAccount((s) => s.plan);
  return (
    <>
      <PageHeader title="Woordwerk Plus" intro={PLUS_ON ? 'Alles uit Woordwerk, voor wie serieus wil leren.' : 'Op dit moment is alles in Woordwerk gratis.'} />
      <div className="grid max-w-4xl gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">Gratis</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {free.map((f) => <li key={f} className="flex gap-2"><Check size={18} className="mt-0.5 shrink-0 text-primary-ink" aria-hidden="true" />{f}</li>)}
          </ul>
        </Card>
        <Card className="border-2 border-primary">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Sparkles size={20} aria-hidden="true" /> Plus</h2>
          <p className="text-sm text-ink-soft">Alles van gratis, plus:</p>
          <ul className="mt-3 flex flex-col gap-2">
            {Object.values(plusFeatures).map((f) => <li key={f} className="flex gap-2"><Check size={18} className="mt-0.5 shrink-0 text-primary-ink" aria-hidden="true" />{f}</li>)}
          </ul>
          <div className="mt-5">
            {plan === 'plus' ? (
              <p className="font-bold text-primary-ink">Je hebt Plus. Veel plezier!</p>
            ) : PLUS_ON ? (
              <>
                <p className="mb-2 text-sm text-ink-soft">Betalen kan binnenkort. Maak alvast een account aan.</p>
                <ButtonLink to="/account">Naar je account</ButtonLink>
              </>
            ) : (
              <p className="text-sm text-ink-soft">Je kunt alles nu nog gratis gebruiken.</p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
