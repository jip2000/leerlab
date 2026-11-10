import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { CloudUpload, LogOut, Sparkles, Trash2, UserRound } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { db } from '@/db/db';
import { useAccount } from '@/features/account/store';
import { pushIfChanged, useCloudVersion, useDeviceVersion } from '@/features/account/sync';
import { accountsConfigured, supabase } from '@/lib/supabase';
import { PLUS_ON } from '@/lib/plan';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/cn';

const redirect = () => `${location.origin}${location.pathname}`;

/** Duidelijke Nederlandse foutmeldingen in plaats van de Engelse van Supabase. */
function nl(message: string): string {
  if (/Invalid login credentials/i.test(message)) return 'E-mailadres of wachtwoord klopt niet.';
  if (/Email not confirmed/i.test(message)) return 'Bevestig eerst je e-mailadres: kijk in je mail (ook bij spam).';
  if (/already registered/i.test(message)) return 'Er is al een account met dit e-mailadres. Log in, of kies "Wachtwoord vergeten".';
  if (/Password should be at least/i.test(message)) return 'Je wachtwoord moet minstens 8 tekens hebben.';
  if (/rate limit/i.test(message)) return 'Even te veel pogingen. Wacht een paar minuten en probeer het opnieuw.';
  return `Dat lukte niet: ${message}`;
}

export function AccountPage() {
  const [params, setParams] = useSearchParams();
  const { session, plan, ready, conflict, setConflict } = useAccount();
  const syncedAt = useLiveQuery(async () => (await db.meta.get('syncedAt'))?.value as number | undefined, []);
  const [tab, setTab] = useState<'inloggen' | 'maken' | 'vergeten'>('inloggen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'fout' | 'ok'; text: string } | null>(
    params.get('fout') ? { kind: 'fout', text: decodeURIComponent(params.get('fout')!).replace(/\+/g, ' ') } : null,
  );
  const recovery = params.get('nieuw-wachtwoord') === '1';

  if (!accountsConfigured) {
    return (
      <>
        <PageHeader title="Account" />
        <Card className="max-w-xl">
          <p className="font-semibold">Inloggen is nog niet ingesteld.</p>
          <p className="mt-1 text-ink-soft">Je kunt Woordwerk gewoon zonder account gebruiken: alles staat op dit apparaat. Een back-up maak je bij Instellingen.</p>
        </Card>
      </>
    );
  }
  if (!ready) return null;

  const run = async (fn: () => Promise<{ error: { message: string } | null }>, ok?: string) => {
    setBusy(true);
    setMessage(null);
    const { error } = await fn();
    setBusy(false);
    if (error) setMessage({ kind: 'fout', text: nl(error.message) });
    else if (ok) setMessage({ kind: 'ok', text: ok });
  };

  if (session && recovery) {
    return (
      <>
        <PageHeader title="Nieuw wachtwoord" />
        <form className="flex max-w-md flex-col gap-4" onSubmit={(e) => { e.preventDefault(); void run(() => supabase!.auth.updateUser({ password }), 'Je wachtwoord is veranderd.').then(() => setParams({})); }}>
          <Field label="Nieuw wachtwoord (minstens 8 tekens)">
            <Input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {message && <p role="alert" className={message.kind === 'fout' ? 'font-semibold text-danger' : 'font-semibold text-primary-ink'}>{message.text}</p>}
          <Button type="submit" disabled={busy}>Opslaan</Button>
        </form>
      </>
    );
  }

  if (session) {
    const user = session.user;
    return (
      <>
        <PageHeader title="Account" intro="Je gegevens worden op al je apparaten bijgehouden." />
        <div className="grid max-w-3xl gap-4">
          <Card className="flex flex-wrap items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary-ink"><UserRound size={24} aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{user.email}</p>
              <p className="text-sm text-ink-soft">
                {plan === 'plus' ? '✨ Woordwerk Plus' : PLUS_ON ? 'Gratis account' : 'Account (alles is nu nog gratis)'}
              </p>
            </div>
            {PLUS_ON && plan !== 'plus' && <ButtonLink to="/plus"><Sparkles size={18} aria-hidden="true" /> Bekijk Plus</ButtonLink>}
          </Card>

          {conflict && (
            <Card className="border-marker bg-marker/20">
              <h2 className="font-bold">Welke gegevens wil je houden?</h2>
              <p className="mt-1 text-sm text-ink-soft">Op dit apparaat staan andere lijsten dan in je account. Kies welke versie je wilt gebruiken; de andere wordt vervangen.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={async () => { await useCloudVersion(conflict); setConflict(null); toast('Gegevens uit je account opgehaald'); }}>Die uit mijn account</Button>
                <Button variant="secondary" onClick={async () => { await useDeviceVersion(user.id); setConflict(null); toast('Gegevens van dit apparaat opgeslagen in je account'); }}>Die van dit apparaat</Button>
              </div>
            </Card>
          )}

          <Card>
            <h2 className="font-bold">Synchroniseren</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Woordwerk stuurt veranderingen elke minuut naar je account.{' '}
              {syncedAt ? `Laatst bijgewerkt: ${new Date(syncedAt).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' })}.` : ''} Foto's van je boek en woordplaatjes blijven alleen op dit apparaat.
            </p>
            <Button className="mt-3" variant="secondary" icon={<CloudUpload size={18} aria-hidden="true" />} disabled={!!conflict || busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const sent = await pushIfChanged(user.id);
                  toast(sent ? 'Bijgewerkt in je account' : 'Alles was al bijgewerkt');
                } catch {
                  toast('Synchroniseren lukte niet. Heb je internet?');
                } finally {
                  setBusy(false);
                }
              }}>
              Nu synchroniseren
            </Button>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={<LogOut size={18} aria-hidden="true" />} onClick={async () => { await supabase!.auth.signOut(); toast('Je bent uitgelogd. Je gegevens blijven op dit apparaat.'); }}>
              Uitloggen
            </Button>
            <Button variant="ghost" className="text-danger" icon={<Trash2 size={18} aria-hidden="true" />}
              onClick={async () => {
                if (!confirm('Weet je het zeker? Je account en alles wat in je account staat, wordt verwijderd. Wat op dit apparaat staat, blijft.')) return;
                const { error } = await supabase!.rpc('verwijder_mijn_account');
                if (error) return toast(nl(error.message));
                await supabase!.auth.signOut();
                toast('Je account is verwijderd.');
              }}>
              Account verwijderen
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Account" intro="Met een account staan je lijsten en voortgang op al je apparaten. Het hoeft niet: zonder account werkt alles ook." />
      <div className="max-w-md">
        <div role="tablist" aria-label="Account" className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-surface-2 p-1">
          {([['inloggen', 'Inloggen'], ['maken', 'Account maken'], ['vergeten', 'Wachtwoord vergeten']] as const).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setMessage(null); }}
              className={cn('min-h-11 rounded-xl px-2 text-sm font-semibold', tab === id ? 'bg-surface shadow-soft' : 'text-ink-soft')}>
              {label}
            </button>
          ))}
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (tab === 'inloggen') void run(() => supabase!.auth.signInWithPassword({ email, password }));
            if (tab === 'maken') void run(() => supabase!.auth.signUp({ email, password, options: { emailRedirectTo: redirect() } }), 'Bijna klaar! Klik op de link in de mail die we je stuurden (kijk ook bij spam).');
            if (tab === 'vergeten') void run(() => supabase!.auth.resetPasswordForEmail(email, { redirectTo: redirect() }), 'Als er een account is met dit adres, krijg je een mail met een link om een nieuw wachtwoord te kiezen.');
          }}
        >
          <Field label="E-mailadres">
            <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          {tab !== 'vergeten' && (
            <Field label={tab === 'maken' ? 'Wachtwoord (minstens 8 tekens)' : 'Wachtwoord'}>
              <Input type="password" autoComplete={tab === 'maken' ? 'new-password' : 'current-password'} minLength={tab === 'maken' ? 8 : undefined} required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
          )}
          {tab === 'maken' && (
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[var(--primary)]" />
              <span>Ik ben 16 jaar of ouder, of mijn ouders vinden het goed. Ik heb gelezen <a href="#/privacy" className="font-semibold text-primary-ink underline">wat Woordwerk bewaart</a>.</span>
            </label>
          )}
          {message && <p role="alert" className={message.kind === 'fout' ? 'font-semibold text-danger' : 'font-semibold text-primary-ink'}>{message.text}</p>}
          <Button type="submit" size="lg" className="justify-center" disabled={busy}>
            {tab === 'inloggen' ? 'Inloggen' : tab === 'maken' ? 'Account maken' : 'Stuur mij een link'}
          </Button>
        </form>
      </div>
    </>
  );
}
