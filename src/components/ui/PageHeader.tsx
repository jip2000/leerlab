import type { ReactNode } from 'react';

/** Titel bovenaan elke pagina, met de markeerstift-streep. */
export function PageHeader({ title, intro, actions }: { title: string; intro?: string; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div>
        <h1 className="text-[28px] leading-[1.15] font-extrabold tracking-[-0.025em] sm:text-[34px]">
          <span className="marker">{title}</span>
        </h1>
        {intro && <p className="mt-2 max-w-[60ch] text-ink-soft">{intro}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </header>
  );
}
