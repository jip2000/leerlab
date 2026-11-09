import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-[var(--radius-control)] border border-line bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-soft focus-visible:border-primary',
        className,
      )}
      {...rest}
    />
  );
});
