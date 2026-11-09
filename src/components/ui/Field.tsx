import { useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Label boven een invoerveld, met optioneel een korte uitleg eronder. */
export function Field({ label, children, className, hint }: { label: string; children: ReactNode; className?: string; hint?: string }) {
  const hintId = useId();
  return (
    <div className={cn('flex flex-col gap-1.5', className)} aria-describedby={hint ? hintId : undefined}>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{label}</span>
        {children}
      </label>
      {hint && (
        <span id={hintId} className="text-sm text-ink-soft">
          {hint}
        </span>
      )}
    </div>
  );
}

export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-[var(--radius-control)] border border-line bg-surface px-3 text-[15px] text-ink focus-visible:border-primary',
        className,
      )}
      {...rest}
    />
  );
}
