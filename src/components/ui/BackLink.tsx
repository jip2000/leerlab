import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export function BackLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="-ml-1 mb-2 inline-flex h-11 items-center gap-1 rounded-lg pr-2 text-sm font-semibold text-ink-soft hover:text-ink">
      <ChevronLeft size={18} aria-hidden="true" /> {children}
    </Link>
  );
}
