import { cn } from '@/lib/cn';

/** Eigen logo: een stapeltje kaartjes met een gemarkeerde W. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('h-9 w-9', className)} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#08805F" />
      <rect x="15" y="12" width="38" height="42" rx="7" fill="#0E5F48" transform="rotate(9 34 33)" />
      <rect x="10" y="10" width="38" height="42" rx="7" fill="#fff" />
      <rect x="14" y="30" width="30" height="10" rx="3" fill="#FFE066" />
      <path d="M16.5 19l5 18 5-12 5 12 5-18" fill="none" stroke="#0E2A22" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-[19px] font-extrabold tracking-[-0.02em] text-ink">Woordwerk</span>
    </span>
  );
}
