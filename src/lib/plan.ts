/**
 * GRATIS en PLUS.
 * Zolang VITE_PLUS_AAN niet "true" is, is alles gratis (betalen is nog niet aangesloten).
 * Welke functies bij Plus horen, staat hieronder; aanpassen = deze lijst aanpassen.
 */
import { useAccount, type Plan } from '@/features/account/store';

export const PLUS_ON = import.meta.env.VITE_PLUS_AAN === 'true';

export type Feature = 'scannen' | 'werkwoorden' | 'grammatica-oefenen' | 'planner' | 'slim-herhalen' | 'statistieken';

export const plusFeatures: Record<Feature, string> = {
  scannen: 'Foto van je boek scannen → flitskaartjes',
  werkwoorden: 'Werkwoordtrainer voor 7 talen',
  'grammatica-oefenen': 'Alle grammatica-oefeningen (gratis: de eerste 2 onderwerpen per taal)',
  planner: 'Planner met automatisch leerschema',
  'slim-herhalen': 'Slim herhalen: elke dag precies de juiste woorden',
  statistieken: 'Uitgebreide statistieken en grafieken',
};

/** Aantal grammatica-onderwerpen per taal waarmee je gratis mag oefenen. */
export const FREE_GRAMMAR_TOPICS = 2;

export function canUse(feature: Feature, plan: Plan, enforced = PLUS_ON): boolean {
  void feature;
  return !enforced || plan === 'plus';
}

export function usePlusAccess(feature: Feature): boolean {
  const plan = useAccount((s) => s.plan);
  return canUse(feature, plan);
}
