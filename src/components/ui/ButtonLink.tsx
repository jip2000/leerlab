import { Link, type LinkProps } from 'react-router';
import { cn } from '@/lib/cn';

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'bg-surface text-ink border border-line hover:bg-surface-2',
};

/** Een link die eruitziet als een knop. */
export function ButtonLink({ variant = 'primary', className, ...rest }: LinkProps & { variant?: keyof typeof variants }) {
  return (
    <Link
      className={cn(
        'inline-flex h-11 shrink-0 items-center gap-2 rounded-[var(--radius-control)] px-4 text-[15px] font-semibold transition-colors',
        variants[variant],
        className,
      )}
      {...rest}
    />
  );
}
