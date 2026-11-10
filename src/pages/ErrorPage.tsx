import { useEffect } from 'react';
import { useRouteError } from 'react-router';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/** Na een update van de site kan een oud stukje ontbreken: dan één keer automatisch verversen. */
const isStaleChunk = (e: unknown) => /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(String((e as Error)?.message ?? e));

export function ErrorPage() {
  const error = useRouteError();
  const stale = isStaleChunk(error);

  useEffect(() => {
    if (!stale) return;
    if (sessionStorage.getItem('woordwerk-herladen')) return; // niet blijven herladen
    sessionStorage.setItem('woordwerk-herladen', '1');
    location.reload();
  }, [stale]);

  return (
    <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-extrabold">{stale ? 'Er is een nieuwe versie van Woordwerk' : 'Er ging iets mis'}</h1>
      <p className="text-ink-soft">
        {stale ? 'Laad de pagina opnieuw om verder te gaan. Je lijsten en voortgang blijven bewaard.' : 'Probeer de pagina opnieuw te laden. Je lijsten en voortgang blijven bewaard.'}
      </p>
      <Button icon={<RefreshCw size={18} aria-hidden="true" />} onClick={() => { sessionStorage.removeItem('woordwerk-herladen'); location.reload(); }}>
        Opnieuw laden
      </Button>
    </div>
  );
}
