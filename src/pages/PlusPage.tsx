import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Check, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { plusFeatures, PLUS_ON, PRIJS } from '@/lib/plan';
import { useAccount } from '@/features/account/store';
import { naarAbonnementBeheren, naarBetalen } from '@/features/account/payments';
import { fireworks } from '@/lib/confetti';

const free = ['Woordenlijsten maken, plakken, importeren en delen', 'Flashcards, typen, meerkeuze, toets, leren, luisteren, koppelen, snel-ronde', 'Streak, XP, levels en badges', 'Grammatica-uitleg voor 19 talen', 'Offline werken en back-ups'];

const tick = (f: string) => <li key={f} className="flex gap-2"><Check size={18} className="mt-0.5 shrink-0 text-primary-ink" aria-hidden="true" />{f}</li>;

export function PlusPage() {
  const { plan, session, refreshPlan } = useAccount();
  const [params] = useSearchParams();
  const betaald = params.get('betaald') === '1';
  const [busy, setBusy] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  // Net betaald: Stripe meldt het binnen een paar seconden bij ons. Even opnieuw kijken.
  useEffect(() => {
    if (!betaald || !session) return;
    let n = 0;
    const t = setInterval(() => {
      n++;
      void refreshPlan();
      if (n >= 15) clearInterval(t);
    }, 2000);
    return () => clearInterval(t);
  }, [betaald, session?.user.id]);
  useEffect(() => {
    if (betaald && plan === 'plus') fireworks();
  }, [betaald, plan]);

  const run = async (fn: () => Promise<string | null>) => {
    setBusy(true);
    setFout(null);
    const f = await fn();
    if (f) {
      setFout(f);
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Woordwerk Plus" intro={PLUS_ON ? 'Alles uit Woordwerk, voor wie serieus wil leren.' : 'Op dit moment is alles in Woordwerk gratis.'} />
      {betaald && (
        <p role="status" className="mb-4 max-w-4xl rounded-2xl bg-primary-soft p-4 font-semibold text-primary-ink">
          {plan === 'plus' ? '🎉 Bedankt! Je hebt nu Woordwerk Plus.' : 'Bedankt voor je betaling! We zetten Plus nu voor je aan…'}
        </p>
      )}
      <div className="grid max-w-4xl gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">Gratis</h2>
          <ul className="mt-3 flex flex-col gap-2">{free.map(tick)}</ul>
        </Card>
        <Card className="border-2 border-primary">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Sparkles size={20} aria-hidden="true" /> Plus</h2>
          <p className="text-sm text-ink-soft">Alles van gratis, plus:</p>
          <ul className="mt-3 flex flex-col gap-2">{Object.values(plusFeatures).map(tick)}</ul>
          <div className="mt-5 flex flex-col gap-2">
            {!PLUS_ON ? (
              <p className="text-sm text-ink-soft">Je kunt alles nu nog gratis gebruiken.</p>
            ) : plan === 'plus' ? (
              <>
                <p className="font-bold text-primary-ink">Je hebt Plus. Veel plezier!</p>
                <Button variant="secondary" disabled={busy} onClick={() => void run(naarAbonnementBeheren)}>Abonnement beheren of opzeggen</Button>
              </>
            ) : !session ? (
              <>
                <p className="text-sm text-ink-soft">Om Plus te nemen heb je een (gratis) account nodig. Zo weet Woordwerk op al je apparaten dat je Plus hebt.</p>
                <ButtonLink to="/account">Account maken of inloggen</ButtonLink>
              </>
            ) : (
              <>
                <Button size="lg" className="justify-center" disabled={busy} onClick={() => void run(() => naarBetalen('jaar'))}>
                  {PRIJS.jaar} per jaar
                </Button>
                <Button variant="secondary" className="justify-center" disabled={busy} onClick={() => void run(() => naarBetalen('maand'))}>
                  {PRIJS.maand} per maand
                </Button>
                <p className="text-xs text-ink-soft">Betalen met iDEAL of creditcard via Stripe. Opzeggen kan altijd, je houdt Plus tot het einde van de periode.</p>
              </>
            )}
            {fout && <p role="alert" className="font-semibold text-danger">{fout}</p>}
          </div>
        </Card>
      </div>
    </>
  );
}
