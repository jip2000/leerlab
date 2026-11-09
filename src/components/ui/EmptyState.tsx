import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}

/** Lege staat: legt uit wat hier komt en wat je kunt doen. */
export function EmptyState({ icon, title, text, action }: Props) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[var(--radius-card)] border-2 border-dashed border-line p-6 sm:p-8">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-ink">{icon}</div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="max-w-[56ch] text-ink-soft">{text}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
