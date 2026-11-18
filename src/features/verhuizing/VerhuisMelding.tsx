import { useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { exportAll } from '@/lib/backup';
import { useAccount } from '@/features/account/store';
import { nieuwAdresVoor, opOudAdres } from './verhuizing';

/** Melding bovenaan het oude adres: Woordwerk is verhuisd, neem je lijsten mee. */
export function VerhuisMelding() {
  const session = useAccount((s) => s.session);
  const [gedownload, setGedownload] = useState(false);
  if (!opOudAdres()) return null;

  const download = async () => {
    const data = await exportAll();
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'woordwerk-verhuizing.json' });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setGedownload(true);
  };

  return (
    <div role="region" aria-label="Woordwerk is verhuisd" className="mb-5 rounded-[var(--radius-card)] border-2 border-primary bg-primary-soft p-4">
      <h2 className="text-lg font-extrabold">📦 Woordwerk is verhuisd naar woordwerk.online</h2>
      {session ? (
        <p className="mt-1">Je bent ingelogd. Log op <strong>woordwerk.online</strong> in met hetzelfde account, dan staan al je lijsten daar ook.</p>
      ) : (
        <ol className="mt-1 list-decimal pl-5">
          <li>Download je lijsten (één bestand).</li>
          <li>Open woordwerk.online → <strong>Instellingen</strong> → <strong>Importeer back-up</strong> en kies dat bestand.</li>
        </ol>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {!session && (
          <Button variant={gedownload ? 'secondary' : 'primary'} icon={<Download size={18} aria-hidden="true" />} onClick={() => void download()}>
            {gedownload ? 'Gedownload ✓' : 'Download je lijsten'}
          </Button>
        )}
        <a
          href={nieuwAdresVoor(session || gedownload ? '#/instellingen' : '')}
          className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] border border-line bg-surface px-4 font-semibold hover:bg-surface-2"
        >
          <ExternalLink size={18} aria-hidden="true" /> Naar woordwerk.online
        </a>
      </div>
    </div>
  );
}
