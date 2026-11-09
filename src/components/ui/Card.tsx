import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const tones = {
  default: 'border-line bg-surface shadow-soft',
  mint: 'border-transparent bg-primary-soft',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: keyof typeof tones;
}

export function Card({ tone = 'default', className, ...rest }: CardProps) {
  return <div className={cn('rounded-[var(--radius-card)] border p-5', tones[tone], className)} {...rest} />;
}
