import { Link } from 'react-router';
import { PageHeader } from '@/components/ui/PageHeader';

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Deze pagina bestaat niet" intro="Misschien is de link verkeerd overgetypt." />
      <Link to="/" className="inline-flex h-11 items-center rounded-[var(--radius-control)] bg-primary px-4 font-semibold text-on-primary">
        Naar Home
      </Link>
    </>
  );
}
